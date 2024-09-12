import React, { useEffect, useState } from "react";
import Test from "./components/Test";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = () => {
      setTimeout(() => {
        setLoading(false);
      }, 9900);
    };

    loader();
  }, []);

  //return loading ? <Preloader /> : <PipBoy/>;
  //return <PipBoy/>;
  return <Test />;
}

export default App;
