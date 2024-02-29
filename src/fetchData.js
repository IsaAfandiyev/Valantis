import md5 from "md5";
import axios from "axios";

export async function fetchData(payload) {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const response = await axios.request({
    url: `http://api.valantis.store:40000/`,
    method: "POST",
    headers: {
      "X-Auth": md5(`Valantis_${currentDate}`),
      "Content-Type": "application/json",
    },
    data: payload,
  });

  return response.data.result;
}
