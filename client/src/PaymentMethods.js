import "./styles.css";

export default function Payments(props) {
  return (
    <div className="paymentsCards">
      <img className="imagePaymentMethods" src={props.imagePaymentMethods} />
    </div>
  );
}
