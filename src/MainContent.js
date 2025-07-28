import React from "react";
import Payments from "./PaymentMethods";
import { paymentMethodsData1, paymentMethodsData2 } from "./PaymentMethodsData";

export default function MainContent() {

  const paymentMethods1 = paymentMethodsData1.map((item) => {
    return (
      <Payments key={item.id} imagePaymentMethods={item.imagePaymentMethods} />
    );
  });

  const paymentMethods2 = paymentMethodsData2.map((item) => {
    return (
      <Payments
        key={item.id}
        imagePaymentMethods={item.imagePaymentMethods}
        noRadius={true}
      />
    );
  });

  return (
    <>
      <div className="formasPagamento">
        <h1>Formas de pagamento:</h1>
        <div className="paymentMethodsRow">
          <div className="paymentMethodsCards1">{paymentMethods1}</div>
        </div>
        <div className="cartoesCredito">
          <p>Cartões de Crédito:</p>
          <div className="paymentMethodsCards2">{paymentMethods2}</div>
        </div>
      </div>
    </>
  );
}
