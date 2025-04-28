import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";

export interface Payment {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
}

export type TypeResponseMidtrans = {
  token: string;
  redirect_url: string;
};

export type MidtransCallbackData = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: "settlement" | "pending" | "cancel" | "deny" | "expire";
  fraud_status: "accept" | "deny" | "challenge";
};

export default {
  async createLink(payload: Payment): Promise<TypeResponseMidtrans> {
    const result = await axios.post<TypeResponseMidtrans>(MIDTRANS_TRANSACTION_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
      },
    });
    if (result.status !== 201) throw new Error("payment failed");

    return result?.data;
  },
};
