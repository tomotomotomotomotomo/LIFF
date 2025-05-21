import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseKey = "YOUR_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

// LIFF初期化＆ユーザー情報取得
window.onload = async () => {
  await liff.init({ liffId: "YOUR_LIFF_ID" });
  if (!liff.isLoggedIn()) liff.login();
  const user = await liff.getProfile();
  window.userId = user.userId;

  loadDiaries();
};

document.getElementById("submit").onclick = async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const isPublic = document.getElementById("isPublic").checked;

  const { error } = await supabase.from("diaries").insert([{
    user_id: window.userId,
    title,
    content,
    is_public: isPublic,
  }]);

  if (error) {
    alert("投稿失敗：" + error.message);
  } else {
    alert("投稿完了！");
    loadDiaries();
  }
};

async function loadDiaries() {
  const list = document.getElementById("diaryList");
  list.innerHTML = "";

  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", window.userId)
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = "<li>読み込みエラー</li>";
    return;
  }

  for (const diary of data) {
    const li = document.createElement("li");
    li.textContent = `${diary.created_at.slice(0, 10)}：${diary.title}`;
    list.appendChild(li);
  }
}
