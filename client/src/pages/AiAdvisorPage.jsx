import { useState } from "react";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ProductVisual from "../components/ProductVisual.jsx";
import SimpleHeader from "../components/SimpleHeader.jsx";
import { formatPrice } from "../data/products.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const questions = [
  { key: "skin", text: "Da của bạn thuộc loại nào nhỉ?", choices: ["Da dầu", "Da khô", "Da hỗn hợp", "Da nhạy cảm"] },
  { key: "concern", text: "Bạn đang quan tâm nhất đến điều gì?", choices: ["Cấp ẩm", "Làm sáng", "Chống nắng", "Phục hồi"] },
  { key: "budget", text: "Ngân sách bạn muốn dành cho một sản phẩm là bao nhiêu?", choices: ["Dưới 250.000đ", "250.000–400.000đ", "Trên 400.000đ"] },
];
const categoryTones = { "Chăm sóc da": "peach", "Chống nắng": "blue", "Trang điểm": "rose", "Chăm sóc tóc": "lavender", "Thiên nhiên": "cream" };

function AiAdvisorPage() {
  const [messages, setMessages] = useState([{ from: "ai", text: `Chào bạn, mình sẽ gợi ý sản phẩm đang bán trong cửa hàng. ${questions[0].text}` }]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ skin: "", concern: "", budget: "" });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const findRecommendations = async (answers, query = "") => {
    setLoading(true);
    setRecommendations([]);
    try {
      const response = await fetch(`${API}/api/advisor/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, query }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể tìm sản phẩm.");
      setRecommendations(result.data);
      setMessages((current) => [...current, { from: "ai", text: `${result.message} Gợi ý được chọn từ sản phẩm còn hàng trong MySQL theo nhu cầu và ngân sách bạn đã nhập.` }]);
    } catch (error) {
      setMessages((current) => [...current, { from: "ai", text: error.message || "Không thể kết nối cửa hàng. Hãy thử lại." }]);
    } finally { setLoading(false); }
  };

  const chooseAnswer = (answer) => {
    const question = questions[step];
    const nextProfile = { ...profile, [question.key]: answer };
    setProfile(nextProfile);
    setMessages((current) => [...current, { from: "user", text: answer }, ...(step < questions.length - 1 ? [{ from: "ai", text: questions[step + 1].text }] : [])]);
    setStep((value) => Math.min(value + 1, questions.length));
    if (step === questions.length - 1) findRecommendations(nextProfile);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const query = input.trim();
    if (!query || loading) return;
    setInput("");
    setMessages((current) => [...current, { from: "user", text: query }]);
    if (step < questions.length) {
      setMessages((current) => [...current, { from: "ai", text: `Hãy chọn câu trả lời bên dưới trước nhé. ${questions[step].text}` }]);
      return;
    }
    findRecommendations(profile, query);
  };

  const progress = Math.round((Object.values(profile).filter(Boolean).length / questions.length) * 100);
  return <div className="sub-page ai-page"><SimpleHeader /><main className="container ai-advisor">
    <div className="breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><strong>AI tư vấn</strong></div>
    <div className="ai-page-heading"><span className="eyebrow"><Sparkles size={15} /> BEAUTY INTELLIGENCE</span><h1>Routine của bạn,<br /><em>bắt đầu từ đây.</em></h1><p>Chọn nhu cầu để tìm sản phẩm đang bán, còn hàng và phù hợp ngân sách.</p></div>
    <div className="advisor-layout"><section className="chat-card"><div className="chat-top"><div className="ai-avatar"><Bot size={19} /></div><div><strong>Gợi ý mỹ phẩm</strong><small><i /> Dữ liệu cửa hàng</small></div><span className="chat-secure">Gợi ý theo thông tin sản phẩm</span></div>
      <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={index}><span>{message.text}</span></div>)}
        {loading && <div className="chat-message ai"><span>Đang tìm sản phẩm còn hàng...</span></div>}
        {step < questions.length && <div className="quick-replies">{questions[step].choices.map((choice) => <button type="button" key={choice} onClick={() => chooseAnswer(choice)}>{choice}</button>)}</div>}
        {recommendations.length > 0 && <div className="recommendations">{recommendations.map((product) => <Link to={`/san-pham/${product.id}`} className="recommendation" key={product.id}><ProductVisual tone={categoryTones[product.category] || "peach"} image={product.image} /><span><small>{product.category} · Còn {product.stock}</small><strong>{product.name}</strong><b>{formatPrice(product.price)}</b></span><ArrowRight size={15} /></Link>)}</div>}
      </div>
      <form className="chat-input" onSubmit={sendMessage}><input value={input} onChange={(event) => setInput(event.target.value)} maxLength={120} placeholder={step < questions.length ? "Chọn câu trả lời bên trên..." : "Nhập nhu cầu để tìm lại..."} /><button aria-label="Gửi tin nhắn" disabled={loading}><ArrowRight size={17} /></button></form>
    </section><aside className="advisor-side"><div className="advisor-note"><Sparkles size={18} /><h3>Tư vấn có trách nhiệm</h3><p>Gợi ý được chọn theo danh mục, tên, giá và tình trạng còn hàng trong cửa hàng.</p><span>Không chẩn đoán hoặc điều trị bệnh.</span></div><div className="progress-card"><div><span>Hồ sơ làm đẹp</span><strong>{progress}%</strong></div><div className="progress-bar"><i style={{ width: `${progress}%` }} /></div><small>Hoàn thành các câu hỏi để nhận gợi ý phù hợp hơn</small></div></aside></div>
  </main></div>;
}

export default AiAdvisorPage;
