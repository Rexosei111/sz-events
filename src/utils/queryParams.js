export function generateQueryParams(obj) {
  const queryParams = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value !== undefined) {
        queryParams.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        );
      }
    }
  }

  return queryParams.join("&");
}

export function objectToQueryString(obj) {
  const params = new URLSearchParams();

  for (const key in obj) {
    const value = obj[key];

    if (value !== null && !(Array.isArray(value) && value.length === 0)) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          params.append(key, item);
        });
      } else {
        params.append(key, value);
      }
    }
  }

  return params.toString();
}
