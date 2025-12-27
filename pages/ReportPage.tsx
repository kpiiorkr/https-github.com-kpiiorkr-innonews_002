
import React, { useState } from 'react';
import { useApp } from '../store';
import { AlertCircle } from 'lucide-react';

const ReportPage: React.FC = () => {
  const { addReport } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    content: '',
    agree: false,
    isUrgent: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    let shouldMail = false;
    // 긴급 제보인 경우 사용자 의사 확인
    if (formData.isUrgent) {
      const confirmUrgent = window.confirm("긴급 제보로 전송하시겠습니까? '확인'을 누르면 담당 부서로 메일 발송 화면이 열립니다.");
      if (confirmUrgent) {
        shouldMail = true;
      } else {
        // 취소를 눌렀을 때의 동작: 긴급 여부만 해제하고 시스템에는 저장할 것인지, 혹은 전송 자체를 취소할 것인지 결정
        // 여기서는 "Yes인 경우에만 mailto"라는 조건에 맞춰, 메일 발송만 하지 않고 시스템 등록은 진행합니다.
        alert("일반 제보 시스템으로만 등록됩니다.");
      }
    }

    setIsSubmitting(true);
    
    // Simulate API storage
    addReport({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      fileName: file?.name,
      submittedAt: new Date().toLocaleString()
    });

    if (shouldMail) {
      const subject = encodeURIComponent(`[이노뉴스 긴급 제보] ${formData.title}`);
      const body = encodeURIComponent(
        `제보자명: ${formData.name}\n` +
        `연락처: ${formData.phone}\n` +
        `이메일: ${formData.email}\n\n` +
        `[내용]\n${formData.content}`
      );
      window.location.href = `mailto:ai@aag.co.kr?subject=${subject}&body=${body}`;
    }

    alert('제보가 정상적으로 접수되었습니다.');
    setFormData({ name: '', email: '', phone: '', title: '', content: '', agree: false, isUrgent: false });
    setFile(null);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">기사제보</h1>
        <p className="text-gray-600 leading-relaxed">
          주변의 따뜻한 미담부터 사건사고, 부정부패 고발까지<br />
          이노뉴스는 여러분의 소중한 제보를 기다립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 shadow-sm rounded-lg">
        <div className="space-y-6">
          <div className={`p-4 rounded-lg flex items-center justify-between transition-colors ${formData.isUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className={formData.isUrgent ? 'text-red-600' : 'text-gray-400'} />
              <div>
                <p className={`font-bold text-sm ${formData.isUrgent ? 'text-red-900' : 'text-gray-700'}`}>긴급 제보</p>
                <p className="text-xs text-gray-500">사안이 시급한 경우 체크하세요. (메일 발송 여부 선택 가능)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isUrgent" 
                checked={formData.isUrgent} 
                onChange={handleChange} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이름*</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">연락처*</label>
              <input 
                type="text" name="phone" required placeholder="010-0000-0000" value={formData.phone} onChange={handleChange}
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none rounded" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">이메일*</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none rounded" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">제목*</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleChange}
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none rounded" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">내용*</label>
            <textarea 
              name="content" required rows={8} value={formData.content} onChange={handleChange}
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none rounded"
            ></textarea>
          </div>

          <div className="bg-gray-50 p-4 border border-gray-200 rounded">
            <h4 className="font-bold text-sm mb-2">개인정보 수집 및 이용안내</h4>
            <label className="flex items-center text-sm cursor-pointer">
              <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} className="mr-2" />
              이용약관 및 개인정보 취급방침에 동의합니다. (필수)
            </label>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-grow py-4 text-white font-bold hover:opacity-90 transition-colors disabled:bg-gray-400 rounded shadow-md ${formData.isUrgent ? 'bg-red-600' : 'bg-blue-900'}`}
            >
              {isSubmitting ? '전송 중...' : '제보하기'}
            </button>
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="w-1/4 py-4 border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold transition-colors rounded"
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportPage;
