import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class WompiService {
  private readonly baseUrl = process.env.WOMPI_API_URL;
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY;
  private readonly integrityKey = process.env.WOMPI_INTEGRITY_KEY;

  async getAcceptanceTokens(): Promise<{
    acceptanceToken: string;
    personalAuthToken: string;
  }> {
    const response = await axios.get(
      `${this.baseUrl}/merchants/${this.publicKey}`,
    );
    return {
      acceptanceToken: response.data.data.presigned_acceptance.acceptance_token,
      personalAuthToken: response.data.data.presigned_personal_data_auth.acceptance_token,
    };
  }

  async tokenizeCard(cardData: {
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardHolder: string;
  }): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/tokens/cards`,
      {
        number: cardData.number,
        cvc: cardData.cvc,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        card_holder: cardData.cardHolder,
      },
      { headers: { Authorization: `Bearer ${this.publicKey}` } },
    );
    return response.data.data.id;
  }

  async createTransaction(data: {
    amountInCents: number;
    reference: string;
    customerEmail: string;
    cardToken: string;
    acceptanceToken: string;
    personalAuthToken: string;
    installments: number;
    vatAmount?: number;
  }): Promise<{ id: string; status: string }> {
    const signature = this.generateSignature(data.reference, data.amountInCents);

    const body: any = {
      amount_in_cents: data.amountInCents,
      currency: 'COP',
      customer_email: data.customerEmail,
      reference: data.reference,
      acceptance_token: data.acceptanceToken,
      accept_personal_auth: data.personalAuthToken,
      signature,
      payment_method: {
        type: 'CARD',
        installments: data.installments,
        token: data.cardToken,
      },
    };

    if (data.vatAmount) {
      body.taxes = [
        {
          type: 'IVA',
          amount_in_cents: data.vatAmount,
        },
      ];
    }

    const response = await axios.post(
      `${this.baseUrl}/transactions`,
      body,
      { headers: { Authorization: `Bearer ${this.privateKey}` } },
    );

    return {
      id: response.data.data.id,
      status: response.data.data.status,
    };
  }

  async getTransactionStatus(wompiId: string): Promise<string> {
    const response = await axios.get(
      `${this.baseUrl}/transactions/${wompiId}`,
      { headers: { Authorization: `Bearer ${this.publicKey}` } },
    );
    return response.data.data.status;
  }

  generateSignature(reference: string, amountInCents: number): string {
    const str = `${reference}${amountInCents}COP${this.integrityKey}`;
    // Crypto convert the result binary to hex string
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}