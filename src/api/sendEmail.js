import api from "../app/axios";

/**
 * 이메일 전송 API (명세서 기반)
 * @param {Object} data - 이메일 전송 데이터
 *   {
 *     account_id: number, // 발신자 계정 ID
 *     to: string[],       // 수신자 이메일 주소 배열
 *     subject: string,    // 제목
 *     body: string,       // 본문
 *     is_html?: boolean,  // HTML 여부(옵션)
 *     cc?: string[],      // 참조(옵션)
 *     bcc?: string[],     // 숨은참조(옵션)
 *     files?: File[]      // 첨부파일(옵션)
 *   }
 * @returns {Promise<Object>} - 전송 결과
 */
export const sendEmail = async ({
  account_id,
  to,
  subject,
  body,
  is_html = false,
  cc = [],
  bcc = [],
  files = [],
}) => {
  const formData = new FormData();
  formData.append("account_id", account_id);
  to.forEach((addr) => formData.append("to", addr));
  formData.append("subject", subject);
  formData.append("body", body);
  formData.append("is_html", is_html ? "true" : "false");
  cc.forEach((addr) => formData.append("cc", addr));
  bcc.forEach((addr) => formData.append("bcc", addr));
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }
  const response = await api.post("/email/send/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
