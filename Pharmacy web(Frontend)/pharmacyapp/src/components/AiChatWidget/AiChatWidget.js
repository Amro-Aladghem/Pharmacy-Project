import { Fragment, useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Fab, IconButton, Paper } from "@mui/material";
import Typography from "@mui/joy/Typography";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ProductCard from "../Card/ProductCard/ProductCard";
import { SearchProductsWithAi } from "../../services/phProductsServices";

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  text: "كيف يمكنني المساعدة؟",
  products: [],
};

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const message = draft.trim();
    if (!message || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: message,
        products: [],
      },
    ]);
    setDraft("");
    setLoading(true);

    const response = await SearchProductsWithAi(message);
    setLoading(false);

    if (!response.IsSuccess) {
      setMessages((previous) => [
        ...previous,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: "تعذر الحصول على رد حاليًا. حاول مرة أخرى.",
          products: [],
        },
      ]);
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: response.result?.message || "",
        products: response.result?.products || [],
      },
    ]);
  };

  return (
    <div className="ai-chat-dock">
      <Fab
        className="ai-chat-launcher"
        color="primary"
        aria-label={open ? "إغلاق مساعد PharmaPal" : "اسأل مساعد PharmaPal"}
        onClick={() => setOpen((previous) => !previous)}
      >
        {open ? <CloseIcon /> : <SmartToyOutlinedIcon />}
      </Fab>

      {open && (
        <Paper
          className="ai-chat-panel"
          role="dialog"
          aria-label="مساعد PharmaPal"
          elevation={8}
        >
          <div className="ai-chat-header">
            <div className="ai-chat-heading">
              <span className="ai-chat-avatar">
                <SmartToyOutlinedIcon />
              </span>
              <div>
                <Typography level="title-md">مساعد PharmaPal</Typography>
                <span>كيف نقدر نساعدك؟</span>
              </div>
            </div>
            <IconButton
              size="small"
              aria-label="إغلاق المحادثة"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className="ai-chat-messages" ref={messagesContainerRef}>
            {messages.map((item) => (
              <Fragment key={item.id}>
                <div
                  className={`ai-chat-message ${
                    item.role === "user" ? "user-message" : "assistant-message"
                  }`}
                >
                  <span className="ai-chat-sender">
                    {item.role === "user" ? "أنت" : "PharmaPal"}
                  </span>
                  {item.text && <p>{item.text}</p>}
                </div>

                {item.role === "assistant" && item.products.length > 0 && (
                  <div className="ai-chat-message assistant-message products-message">
                    <span className="ai-chat-sender">منتجات قد تهمك</span>
                    <div className="ai-chat-products">
                      {item.products.map((product) => (
                        <ProductCard
                          key={product.phProductId}
                          Id={product.phProductId}
                          Image={product.productImageURL}
                          Name={product.name}
                          PharmacyName={product.phName}
                          Price={product.price}
                          PharmacyId={product.pharmacyId}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}

            {loading && (
              <div className="ai-chat-message assistant-message">
                <span className="ai-chat-sender">PharmaPal</span>
                <Box className="ai-chat-loading">
                  <CircularProgress size={24} />
                </Box>
              </div>
            )}
          </div>

          <form className="ai-chat-compose" onSubmit={handleSubmit}>
            <input
              dir="rtl"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="اكتب سؤالك هنا..."
              aria-label="اكتب رسالتك"
            />
            <IconButton
              type="submit"
              disabled={!draft.trim() || loading}
              aria-label="إرسال الرسالة"
              className="ai-chat-send"
            >
              <SendRoundedIcon />
            </IconButton>
          </form>
        </Paper>
      )}
    </div>
  );
}

export default AiChatWidget;
