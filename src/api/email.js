import api from "../app/axios";

/**
 * 메일 통합 조회
 * 여러 계정의 이메일을 필터링하여 조회합니다.
 *
 * @param {Object} params - 조회 조건 객체
 * @param {string} [params.accounts] - 쉼표로 구분된 이메일 계정 주소 (예: "user1@gmail.com,user2@naver.com")
 * @param {string} [params.folder] - 폴더 필터: "inbox" | "sent" | "spam" | "starred" | "trash"
 * @param {string} [params.query] - 검색어 (이메일 제목, 발신자, 수신자, 내용 등에서 검색)
 *
 * @returns {Promise<Array>} EmailMetadataList 배열
 * @returns {number} return[].id - 이메일 메타데이터 ID
 * @returns {string} return[].account_address - 계정 이메일 주소
 * @returns {string} return[].folder - 폴더 위치 (inbox/sent/spam/starred/trash)
 * @returns {boolean} return[].is_read - 읽음 상태
 * @returns {boolean} return[].is_important - 중요 메일 표시
 * @returns {boolean} return[].is_pinned - 상단 고정 여부
 * @returns {string} return[].received_at - 수신 시간 (ISO 8601 형식)
 * @returns {Object} return[].email - 이메일 미리보기 정보
 *
 * @example
 * // 특정 계정의 받은 편지함 조회
 * const emails = await getEmails({ accounts: "user@gmail.com", folder: "inbox" });
 *
 * @example
 * // 여러 계정에서 "회의" 키워드로 검색
 * const emails = await getEmails({ accounts: "user1@gmail.com,user2@naver.com", query: "회의" });
 */
export const getEmails = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.accounts) {
    queryParams.append("accounts", params.accounts);
  }
  if (params.folder) {
    queryParams.append("folder", params.folder);
  }
  if (params.query) {
    queryParams.append("query", params.query);
  }

  const url = `/email/${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * 개별 이메일 상세 조회
 * 특정 ID의 이메일 전체 내용을 조회합니다.
 *
 * ⚠️ 주의: 조회 시 자동으로 '읽음' 상태로 변경됩니다.
 *
 * @param {number} emailMetadataId - 이메일 메타데이터 ID
 *
 * @returns {Promise<Object>} EmailDetail 객체
 * @returns {number} return.id - 이메일 메타데이터 ID
 * @returns {string} return.account_address - 계정 이메일 주소
 * @returns {string} return.folder - 폴더 위치 (inbox/sent/spam/starred/trash)
 * @returns {boolean} return.is_read - 읽음 상태
 * @returns {boolean} return.is_important - 중요 메일 표시
 * @returns {boolean} return.is_pinned - 상단 고정 여부
 * @returns {string} return.received_at - 수신 시간 (ISO 8601 형식)
 * @returns {Object} return.email - 이메일 전체 내용 (EmailContent)
 *
 * @example
 * const emailDetail = await getEmailDetail(123);
 * console.log(emailDetail.email.subject); // 이메일 제목
 */
export const getEmailDetail = async (emailMetadataId) => {
  const response = await api.get(`/email/${emailMetadataId}/`);
  return response.data;
};

/**
 * 이메일 메타데이터 부분 수정 (PATCH)
 * 이메일의 상태(폴더, 읽음, 중요, 고정)를 부분적으로 수정합니다.
 *
 * @param {number} emailMetadataId - 이메일 메타데이터 ID
 * @param {Object} data - 수정할 필드들 (부분 수정 가능)
 * @param {string} [data.folder] - 폴더 변경: "inbox" | "sent" | "spam" | "starred" | "trash"
 * @param {boolean} [data.is_read] - 읽음 상태 변경
 * @param {boolean} [data.is_important] - 중요 메일 표시 변경
 * @param {boolean} [data.is_pinned] - 상단 고정 변경
 *
 * @returns {Promise<Object>} 수정된 EmailDetail 객체
 *
 * @example
 * // 이메일을 읽음으로 표시하고 중요 표시
 * await updateEmailMetadata(123, { is_read: true, is_important: true });
 *
 * @example
 * // 이메일을 스팸 폴더로 이동
 * await updateEmailMetadata(123, { folder: "spam" });
 *
 * @example
 * // 이메일을 별표 폴더로 이동하고 상단 고정
 * await updateEmailMetadata(123, { folder: "starred", is_pinned: true });
 */
export const updateEmailMetadata = async (emailMetadataId, data) => {
  const response = await api.patch(`/email/${emailMetadataId}/`, data);
  return response.data;
};

/**
 * 이메일 삭제
 * 이메일을 휴지통으로 이동하거나 영구 삭제합니다.
 *
 * ⚠️ 동작 방식:
 * - 휴지통에 없는 경우: 휴지통으로 이동 (상태 코드 200, 수정된 이메일 정보 반환)
 * - 휴지통에 있는 경우: 영구 삭제/소프트 딜리트 (상태 코드 204, 내용 없음)
 *
 * @param {number} emailMetadataId - 이메일 메타데이터 ID
 *
 * @returns {Promise<Object|undefined>} 휴지통 이동 시 EmailDetail 객체, 영구 삭제 시 undefined
 *
 * @example
 * // 받은 편지함의 이메일 삭제 (휴지통으로 이동)
 * const movedEmail = await deleteEmail(123);
 * console.log(movedEmail.folder); // "trash"
 *
 * @example
 * // 휴지통의 이메일 삭제 (영구 삭제)
 * await deleteEmail(456); // 반환값 없음
 */
export const deleteEmail = async (emailMetadataId) => {
  const response = await api.delete(`/email/${emailMetadataId}/`);
  return response.data;
};
