import React from "react";
import Payments from "./PaymentMethods";
import { usePaymentMethodsByCategory } from "./hooks/usePaymentMethods";
// Mantener importación como fallback
import { paymentMethodsData1, paymentMethodsData2 } from "./PaymentMethodsData";

export default function MainContent() {
  // Usar hook para obtener datos de la API con fallback a datos estáticos
  const { 
    paymentMethodsData1: apiData1, 
    paymentMethodsData2: apiData2, 
    loading, 
    error 
  } = usePaymentMethodsByCategory();

  // Usar datos de la API si están disponibles, sino usar datos estáticos
  const data1 = apiData1.length > 0 ? apiData1 : paymentMethodsData1;
  const data2 = apiData2.length > 0 ? apiData2 : paymentMethodsData2;

  const paymentMethods1 = data1.map((item) => {
    return (
      <Payments key={item.id} imagePaymentMethods={item.imagePaymentMethods} />
    );
  });

  const paymentMethods2 = data2.map((item) => {
    return (
      <Payments
        key={item.id}
        imagePaymentMethods={item.imagePaymentMethods}
        noRadius={true}
      />
    );
  });

  // Mostrar loading si está cargando
  if (loading) {
    return (
      <div className="formasPagamento">
        <h1>Formas de pagamento:</h1>
        <p>Carregando métodos de pagamento...</p>
      </div>
    );
  }

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
