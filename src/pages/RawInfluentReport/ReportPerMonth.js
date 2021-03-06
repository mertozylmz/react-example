import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import DatePicker from "react-datepicker";
import { Line } from "react-chartjs-2";
import moment from "moment";
import axios from "axios";

const ReportPerMonth = () => {
  //Use state methods for API and chart
  const [startDate, setStartDate] = useState(new Date()); //New data is given because we need to render the component with Todays Data to show it.
  const [endDate, setEndDate] = useState(null);
  const [chartData, setData] = useState(null);
  const formStr2 = "MM/yyyy";

  //On change method to set startDate end endDate for the API
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const report = async () => {
    //We are using moment to just format the data , if you want you can delete or use date-fns.
    const from = moment(startDate).format("YYYY-MM-DD");
    const to = moment(endDate).format("YYYY-MM-DD");
    //request from API
    const response = await axios.get("/api/v1/influent/data/calculated", {
      params: { from, to },
    });

    const data = response.data;

    //Chart dataset documentation. You can check website of the chart. It is documeneted there.
    const chart = {
      labels: data.map((d) => {
        return moment(d.date).format("DD-MM-YYYY");
      }), //Array map for the labels data as DATE.
      datasets: [
        {
          label: "Tss",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 1,
          data: data.map((d) => {
            return d.tss;
          }), //Array map for the data as DATA.
        },
      ],
    };
    setData(chart);
  };

  const inputValue = moment(`${startDate}`).format(formStr2);

  return (
    <>
      <div className="col-12">
        <div className={"form_calendar"}>
          <DatePicker
            selected={startDate}
            // onChange={onChange}
            placeholderText="Choose a date range"
            onChange={(date) => setStartDate(date)}
            // startDate={startDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            openToDate={new Date()}
            value={!endDate ? new Date() : inputValue}
          />
        </div>

        {/* it returns dates array as response after we choose first and second date.  */}

        <div className={"reportsBtns"}>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            onClick={report}
          >
            TSS Total-Disolved (monthly)
          </Button>
        </div>
      </div>

      <div className="col-12 col-md-6">
        {chartData && (
          <Line
            data={chartData}
            options={{
              title: {
                display: true,
                text: "Average Tss",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        )}
      </div>
    </>
  );
};

export default ReportPerMonth;
