import axios from "axios";

export const api = async () => {
  const result = await axios.get("http://localhost:3000");
  //   const { data } = result;
  return result;
};
