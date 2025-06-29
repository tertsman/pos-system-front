


// ✅ ស្វែងរកឱ្យបានច្បាស់ប្រភេទ status ត្រូវគឺជា string
export const setServerStatus = (status) => {
  localStorage.setItem("server_status", status.toString());
};

// ✅ បម្លែង status ទៅជាលេខ
export const getServerStatus = () => {
  const status = localStorage.getItem("server_status");
  return status ; // ប្តូរពី string ទៅ number
};
// ? parseInt(status) : null
