"use client";

import { Timestamp } from "firebase/firestore";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon
} from "@radix-ui/react-icons";
import { formatTimestamp } from "@/utils/firebase";

interface PaymentStatusProps {
  status: "pending" | "success" | "failed";
  amount: number;
  paymentId?: string;
  timestamp?: Timestamp | null;
}

export function PaymentStatus({ status, amount, paymentId, timestamp }: PaymentStatusProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2 bg-white">
      <div className="flex items-center gap-2">
        {status === "success" && <CheckCircledIcon className="h-5 w-5 text-green-600" />}
        {status === "failed" && <CrossCircledIcon className="h-5 w-5 text-red-600" />}
        {status === "pending" && <ClockIcon className="h-5 w-5 text-amber-600" />}
        <h3 className="font-medium">
          Payment {status === "pending" ? "Pending" : status === "success" ? "Completed" : "Failed"}
        </h3>
      </div>

      {paymentId && (
        <div className="text-sm">
          <span className="text-gray-500">Transaction ID:</span>{" "}
          <span className="font-mono text-gray-700">{paymentId}</span>
        </div>
      )}

      {timestamp && (
        <div className="text-sm">
          <span className="text-gray-500">Processed:</span>{" "}
          <span className="text-gray-700">
            {formatTimestamp(timestamp)}
          </span>
        </div>
      )}

      <div className="text-sm">
        <span className="text-gray-500">Amount:</span>{" "}
        <span className="text-gray-700">${(amount / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}