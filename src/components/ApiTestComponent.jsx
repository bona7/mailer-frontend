import { useAccounts } from "@/api/hooks/useAccounts";
import { useAuth } from "@clerk/clerk-react";

function ApiTestComponent() {
  const { data: accounts, isLoading, isError, error } = useAccounts();
  const { isSignedIn, userId } = useAuth();

  return (
    <div className="p-4 m-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">API 연동 테스트</h2>

      <div className="mb-4">
        <h3 className="font-semibold">인증 상태:</h3>
        <p>로그인 여부: {isSignedIn ? "✅ 로그인됨" : "❌ 로그아웃"}</p>
        <p>User ID: {userId || "없음"}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">계정 목록 조회:</h3>
        {isLoading && <p>로딩 중...</p>}
        {isError && (
          <div className="text-red-600">
            <p>에러 발생:</p>
            <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
        {accounts && (
          <div>
            <p className="text-green-600">
              ✅ 성공! ({accounts.length}개 계정)
            </p>
            <pre className="text-sm mt-2 p-2 bg-white rounded">
              {JSON.stringify(accounts, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        <p>API Base URL: {import.meta.env.VITE_API_BASE_URL}</p>
      </div>
    </div>
  );
}

export default ApiTestComponent;
