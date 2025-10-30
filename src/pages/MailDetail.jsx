import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { emailList } from "@/data/dummy_MainPage.jsx";
import MailList from "@/components/MailList";
import AppLayout from "@/components/AppLayout";

const MailDetail = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className="col-start-2 row-start-2 h-full bg-gray-f5/20 rounded-lg border border-primary p-4">
        <div className="flex items-center gap-2 pl-1.5">
          <h2 className="font-h7 text-primary-dark">In box</h2>
          {/* 위 제목 받은 메일 제목으로 변경.  */}
          {/* 우측에 받은 일자 표시 */}
        </div>
        <Separator className="bg-gray-bf" />
        <div className="flex flex-col">
          {/* 내 이메일 */}
          {/* 보낸 사람 */}
          {/* 내용 */}
        </div>
      </section>
    </AppLayout>
  );
};

export default MailDetail;
