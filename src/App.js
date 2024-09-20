import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const convert = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
          { signal: controller.length }
        );

        if (!res.ok) {
          throw new Error("Something went wrong...");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("No response...");
        }

        setResult(data.rates[toCurrency]);
        setIsLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (fromCurrency === toCurrency) return setResult(amount);

    convert();

    return () => {
      controller.abort();
    };
  }, [amount, toCurrency, fromCurrency]);

  return (
    <div>
      <input
        value={amount}
        type="text"
        onChange={(e) => setAmount(Number(e.target.value))}
        disabled={isLoading}
      />
      <label>From: </label>
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <label>To: </label>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {isLoading && <p>Please wait while converting...</p>}
      {result && !isLoading && (
        <p>
          {result} {toCurrency}
        </p>
      )}
    </div>
  );
}

export default App;
