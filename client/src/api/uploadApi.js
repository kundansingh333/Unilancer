// // import api from "./client";

// // /**
// //  * Generic image/file upload to Cloudinary
// //  * @param {File} file
// //  * @param {string} folder (optional, default handled by backend)
// //  */
// // export const uploadImage = (file) => {
// //   const formData = new FormData();
// //   formData.append("image", file);

// //   return api.post("/upload/image", formData, {
// //     headers: {
// //       "Content-Type": "multipart/form-data",
// //     },
// //   });
// // };

// import api from "./client";

// export const uploadImage = (file) => {
//   const formData = new FormData();
//   formData.append("image", file);

//   return api.post("/upload/image", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

import api from "./client";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url; // ✅ MUST return URL
};
