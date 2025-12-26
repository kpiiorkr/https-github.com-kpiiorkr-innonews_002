
import React, { useState } from 'react';
import { useApp } from '../store';

const ReportPage: React.FC = () => {
  const { addReport } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    content: '',
    agree: false
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

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      addReport({
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        fileName: file?.name,
        submittedAt: new Date().toLocaleString()
      });
      alert('제보가 성공적으로 접수되었습니다. 감사합니다.');
      setFormData({ name: '', email: '', phone: '', title: '', content: '', agree: false });
      setFile(null);
      setIsSubmitting(false);
    }, 1000);
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

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이름*</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">연락처*</label>
              <input 
                type="text" name="phone" required placeholder="010-0000-0000" value={formData.phone} onChange={handleChange}
                className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">이메일*</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">제목*</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleChange}
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">내용*</label>
            <textarea 
              name="content" required rows={8} value={formData.content} onChange={handleChange}
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">파일첨부</label>
            <input 
              type="file" onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 text-sm" 
            />
            <p className="mt-1 text-xs text-gray-400">※ 5MB 이하의 이미지, 문서 파일만 가능합니다.</p>
          </div>

          <div className="bg-gray-50 p-4 border border-gray-200">
            <h4 className="font-bold text-sm mb-2">개인정보 수집 및 이용안내</h4>
            <div className="text-xs text-gray-500 h-24 overflow-y-auto mb-3">
              이노뉴스는 원활한 제보 처리 및 결과 통보를 위해 다음과 같이 개인정보를 수집합니다.<br /><br />
              1. 수집항목: 이름, 이메일, 연락처<br />
              2. 수집목적: 기사 제보 접수 및 취재, 결과 답변<br />
              3. 보유기간: 제보 처리 완료 후 1년 간 보관 후 파기
            </div>
            <label className="flex items-center text-sm cursor-pointer">
              <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} className="mr-2" />
              이용약관 및 개인정보 취급방침에 동의합니다. (필수)
            </label>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-grow py-4 bg-blue-900 text-white font-bold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? '전송 중...' : '제보하기'}
            </button>
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="w-1/4 py-4 border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
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
