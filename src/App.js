import React, { useState, useEffect } from "react";
import "./App.css";

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
};

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([fetch("api/branch1.json"), fetch("api/branch2.json"), fetch("api/branch3.json")]);
        const jsonResponses = await Promise.all(responses.map((res) => res.json())).then((data) => {
          const branch1 = data[0].products;
          const branch2 = data[1].products;
          const branch3 = data[2].products;

          const all = [branch1, branch2, branch3];
          return all;
        });

        const mergedData = jsonResponses.reduce((acc, branchData) => {
          branchData.forEach((product) => {
            const existingProductIndex = acc.findIndex((item) => item.name === product.name);
            if (existingProductIndex !== -1) {
              acc[existingProductIndex].revenue += product.unitPrice * product.sold;
            } else {
              product.revenue = product.unitPrice * product.sold;
              acc.push(product);
            }
          });
          return acc;
        }, []);

        setData(mergedData);
        setFilteredData(mergedData);
        // console.log(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredProducts = data.filter((product) => product.name.toLowerCase().includes(searchTerm));
    setFilteredData(filteredProducts);
  };

  const totalRevenue = filteredData.reduce((total, product) => total + product.revenue, 0);

  const sortedData = [...filteredData].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="content">
      <div className="container">
        <div className="mb-4 d-flex justify-content-center fw-bold fs-1">Revenue Aggregator Application</div>
      </div>

      <div className=" d-grid justify-content-center">
        <div className="mb-2">
          <label className="fw-bold" htmlFor="search">
            Search:
          </label>
          <input type="text" id="search" value={searchTerm} onChange={handleSearch} />
        </div>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((product) => (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td>{formatNumber(product.revenue)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="fw-bold">Total Revenue:</td>
              <td>{formatNumber(totalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default App;
