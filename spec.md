# Reflectly (Aura Self AI) — Tài liệu Sản phẩm & Nghiệp vụ (Frontend)

> Tài liệu này mô tả **hiện trạng thực tế** của ứng dụng, dựa trên việc đọc trực tiếp source code (không phải mô tả kỳ vọng/kế hoạch). Mục đích: làm nguồn tham chiếu duy nhất, đáng tin cậy để redesign UI/UX cho app dễ dùng hơn. Tài liệu **không** đề cập tới việc nên thiết kế UI như thế nào — chỉ mô tả tính năng, luồng nghiệp vụ, dữ liệu và quy tắc hiện có.
>
> Tài liệu song song ở backend: [`reflectly-be/spec.md`](https://github.com/hankimthuy/reflectly-be/blob/main/spec.md) (API, database, business logic server-side, AI Coach engine).
>
> Cách duy trì tài liệu này khi có thay đổi mới: xem [`CLAUDE.md`](./CLAUDE.md).

---

## 1. Tổng quan sản phẩm

**Tên hiện tại: "Aura Self AI"** (tên nội bộ trước đây: **"MimoSe" — Make Sense Of ME**, tagline gốc "Leading Self"). Đây là app tự phản chiếu bản thân (self-reflection / self-leadership companion): người dùng ("Self") trò chuyện với một AI companion tên **"Aura"**, các phiên trò chuyện được tóm tắt và trích xuất tự động thành các insight, đồng thời người dùng có thể tự ghi nhật ký (journal) và xây dựng một **Bản đồ Mối quan hệ Cá nhân (Personal Relationship Map — PRM)**.

App hỗ trợ 2 ngôn ngữ VI/EN, đầy đủ tương đương nhau (cả 2 file `src/i18n/locales/*.json` đồng bộ theo key). **Tiếng Anh là ngôn ngữ mặc định** khi người dùng chưa từng chọn ngôn ngữ (kể từ commit đổi mặc định, 2026-09-10) — trước đó mặc định là Tiếng Việt. Người dùng có thể đổi qua lại bất kỳ lúc nào (lựa chọn được nhớ trong `localStorage`).

### 1.1. Lịch sử phát triển (2 lần pivot)

Sản phẩm đã đổi hướng 2 lần, quan trọng để hiểu vì sao trong code còn tồn tại các phần "chết" (không còn UI dùng tới):

1. **Giai đoạn 1 — "MimoSe" (garden-metaphor journal):** Ẩn dụ khu vườn, chia thành các "zone" — Innerverse (năng lượng, giá trị bản thân), Outerverse (mối quan hệ/orbit xã hội), Bridge (Action Protocol — kịch bản ứng phó tình huống lặp lại). Có tính năng Energy Tracking (chấm điểm năng lượng theo ngữ cảnh) và Action Protocol.
2. **Giai đoạn 2 — Pivot sang "AI Coach + Relationship Map"** (commit `49e1e3c`, 2026-08-04): Bỏ ẩn dụ khu vườn, giới thiệu tính năng chat AI Coach và Personal Relationship Map, bỏ khung Innerverse/Outerverse.
3. **Giai đoạn 3 — Rebrand "Aura Self AI"** (commit `00f36ff`, 2026-08-06): Đổi persona "Coach" thành "Aura" (người bạn đồng hành, không phải huấn luyện viên), làm lại design token (`coach-*`), tổng rà soát i18n, chuẩn hoá hệ thống Button.
4. **Giai đoạn 3.1:** Thêm tính năng lưu trữ lịch sử chat + "Insight Catcher" (commit `9904031`, 2026-08-08) và cảnh báo giới hạn chống-lạm-dụng (rate limit) hiển thị lên UI (commit `172fbc5`, 2026-08-09).
5. **Gần nhất — Giai đoạn 4, tái cấu trúc IA "Aura" (nhánh `redesign/aura-hearth`, 2026-09):** Bỏ điều hướng 4-tab + nút nổi (FAB) mở nhanh chat, thay bằng 1 màn hình chủ duy nhất **"Hôm nay" (Today)** tổng hợp mọi thứ cần chú ý trong ngày; đổi tên trang chat "Coach" thành **"Trò chuyện" (Talk)** — thêm dải "đang đọc tâm trạng" ước lượng cảm xúc trực tiếp từ tin nhắn người dùng trong lúc chat; gộp Dashboard cũ và danh sách nhật ký cũ thành 1 hub **"Thấu hiểu" (Reflect)** với 4 tab con: Mọi người, Tấm gương, Dòng thời gian, Nhật ký — trong đó Johari Window trở thành một bề mặt **thường trực** ("Tấm gương / Mirror") thay vì một form nhập 1 lần; đổi tên "Insight Catcher" thành **"Catch" (Giữ lại)** và rút gọn còn đúng 3 đích lưu (một ô của Tấm gương, một Ghi chú tự do, hoặc thêm/sửa một Người) thay vì bộ chọn 5 loại khung cũ; đổi tên trang Profile thành **"Tôi" (You)**. Đây là thay đổi **về tên gọi/điều hướng/UX**, không đổi model dữ liệu hay endpoint backend nào (xem mục 3, 4). Đi kèm là một lần làm mới toàn bộ giao diện trực quan (font chữ, màu sắc, bo góc), thay thế hẳn 2 hệ thống style song song cũ (`coach-*` Tailwind và SCSS/`--garden-*`) bằng một hệ thống token Tailwind CSS duy nhất — xem mục 2.

**Hệ quả cho tài liệu này:** một số model dữ liệu và khoá i18n của giai đoạn 1 (Energy Tracking, Action Protocol, khu vườn) vẫn còn trong code nhưng **không có màn hình nào sử dụng nữa** — xem mục 5 "Tính năng đã chết".

### 1.2. Repo liên quan
- Frontend (repo này): `hankimthuy/reflectly-fe` — React SPA.
- Backend: `hankimthuy/reflectly-be` — Spring Boot API + AI Coach engine (Gemini).

---

## 2. Kiến trúc tổng quan (tóm tắt)

- **Loại ứng dụng:** Single Page Application (SPA), không SSR. React 19 + TypeScript, build bằng Vite.
- **Điều hướng:** react-router-dom, có `ProtectedRoute` chặn truy cập khi chưa đăng nhập hoặc chưa hoàn thành onboarding.
- **Trạng thái server:** TanStack React Query (cache dữ liệu API), bị xoá cache khi gặp lỗi 401 (hết phiên).
- **Giao tiếp API:** một axios instance duy nhất, tự động gắn JWT vào header, tự động đăng xuất khi 401, tự động phát sự kiện toàn cục khi bị giới hạn tần suất (429).
- **Giao diện:** một hệ thống thiết kế Tailwind CSS duy nhất áp dụng thống nhất cho toàn bộ trang — token màu/typography/bo góc định nghĩa tập trung ở `src/styles/tailwind.css`, các trang dùng chung tên biến/class (ví dụ `--color-accent`, `--color-pine`, `.btn`, `.tag`), nên đổi cả bộ nhận diện (màu, font, hình khối) chỉ cần sửa file token này. Không còn tồn tại 2 hệ thống style song song như trước (hệ `coach-*` và SCSS/`--garden-*`/`--c-*` cũ đã được thay thế hoàn toàn ở Giai đoạn 4 — xem mục 1.1).
- **Đa ngôn ngữ:** i18next, 2 ngôn ngữ VI (mặc định)/EN, một số namespace tiếng Anh chưa dịch đầy đủ.
- **Đăng nhập:** Google OAuth (luồng auth-code) hoặc tài khoản/mật khẩu; JWT lưu ở `localStorage`.
- **Triển khai:** nhánh `main` → Azure Static Web Apps (production); nhánh `develop` → AWS EC2 (staging).

---

## 3. Bản đồ màn hình / Route đầy đủ

Đây là bảng route **thực tế theo code** (khác với bảng route cũ trong README — xem mục 9), phản ánh IA "Aura" sau Giai đoạn 4 (mục 1.1). Layout chung, 3 kiểu:
- **`AppShell`** (Today/Talk/Reflect/Sessions/You/Journal editor): điều hướng 4 mục cố định **Hôm nay · Trò chuyện · Thấu hiểu · Tôi** — sidebar bên trái trên desktop, thanh tab dưới cùng trên mobile; không có header phía trên, **không còn nút nổi (FAB)** như trước (mục Talk chính là lối vào chat, luôn có mặt trong điều hướng chính thay vì cần một nút nổi riêng — xem mục 5).
- **`PublicLayout`** (chỉ trang chủ marketing `/`): header đơn giản (wordmark + nút Đăng nhập/Bắt đầu).
- **Không chrome** (Login, Signup, Onboarding): mỗi trang chiếm trọn màn hình, không sidebar/tab/header.

| Route | Quyền truy cập | Màn hình | Mô tả nghiệp vụ |
|---|---|---|---|
| `/` | Công khai | Trang chủ marketing | Hero giới thiệu sản phẩm + khối "6 điều Aura làm" (không phải dữ liệu thật, chỉ minh hoạ): Trò chuyện, Giữ lại (Catch), Tấm gương của bạn (Mirror), Những người trong đó (People), Dòng thời gian, Giá trị của bạn (Core Values). Dành cho khách chưa đăng nhập. |
| `/login` | Công khai | Đăng nhập | Đăng nhập bằng Google (auth-code flow) hoặc bằng tài khoản/mật khẩu. Sau khi đăng nhập thành công, chuyển hướng về trang trước đó hoặc `/home`. |
| `/signup` | Công khai | Đăng ký | Tạo tài khoản mới bằng thông tin (họ tên, tên đăng nhập, mật khẩu). |
| `/home` | Đã đăng nhập | **Hôm nay (Today)** — trang chủ sau đăng nhập | Màn hình chủ duy nhất, thay thế vai trò của Dashboard cũ: lời chào theo giờ trong ngày + chuỗi ngày liên tục; 1 câu gợi mở trò chuyện xoay vòng theo ngày (nút "Bắt đầu tại đây" hoặc "Có chuyện khác"); dải cảm xúc 7 ngày qua (theo entry đã ghi); danh sách "tiếp tục từ đây" (3 mục gần nhất — phiên chat hoặc nhật ký, mới nhất trước); xem trước Tấm gương (số lượng đã "giữ lại" mỗi ô Cởi mở/Điểm mù/Giữ kín/Chưa rõ, có link sang Reflect); danh sách rút gọn "người cần bạn để ý" (từ Bản đồ Mối quan hệ); lối tắt viết nhật ký một mình. Xem chi tiết mục 4.3. |
| `/coach` | Đã đăng nhập | **Trò chuyện (Talk)** với Aura | Trò chuyện thời gian thực với AI companion "Aura", có dải "đang đọc tâm trạng" (mood-read ribbon) ước lượng cảm xúc trực tiếp từ tin nhắn người dùng. Có thể: gửi/nhận tin nhắn, kết thúc phiên (End session), yêu cầu AI tóm tắt phiên trò chuyện (dạng markdown). Panel bên "Catch" cho phép chủ động giữ lại nội dung cuộc trò chuyện. Phiên chat được lưu lại qua `localStorage` để có thể tiếp tục sau khi tải lại trang. Bị giới hạn số lượt nhắn/số phiên theo chống-lạm-dụng (xem mục 4.13). Xem chi tiết mục 4.4, 4.5. |
| `/coach/history` | Đã đăng nhập | Lịch sử trò chuyện (Sessions archive) | Danh sách các phiên chat trước đây (trạng thái, đoạn tóm tắt xem trước), phân trang. |
| `/coach/history/:id` | Đã đăng nhập | Chi tiết một phiên chat | Xem lại toàn bộ transcript và bản tóm tắt markdown (chỉ đọc) của một phiên đã kết thúc. |
| `/reflect/:tab` (`tab` = `people` \| `mirror` \| `timeline` \| `journal`) | Đã đăng nhập | **Thấu hiểu (Reflect)** — hub 4 tab | Gộp vai trò của Dashboard cũ + danh sách nhật ký cũ vào 1 hub duy nhất, 4 tab: **Mọi người** (Bản đồ Mối quan hệ, mục 4.6), **Tấm gương** (Johari Window thường trực, mục 4.7), **Dòng thời gian** (Insight do AI trích xuất, mục 4.8), **Nhật ký** (entries tự viết + "Ghi chú" giữ lại từ chat, mục 4.9). |
| `/reflect` | Đã đăng nhập | — | Redirect sang `/reflect/people`. |
| `/dashboard` | Đã đăng nhập | — | **Đã nghỉ hưu** — chỉ còn là redirect sang `/reflect/people` để tương thích bookmark/link cũ (xem mục 5). |
| `/entries/list` | Đã đăng nhập | — | **Đã nghỉ hưu** — chỉ còn là redirect sang `/reflect/journal` để tương thích bookmark/link cũ (xem mục 5). |
| `/profile` | Đã đăng nhập | **Tôi (You)** — Hồ sơ cá nhân & Cài đặt | Sửa avatar/tên, đổi mật khẩu (chỉ tài khoản đăng ký bằng mật khẩu), thống kê chuỗi ngày liên tục ghi nhật ký (day-streak) và cảm xúc phổ biến nhất (tính từ các entry), biểu đồ phân bố cảm xúc, xem/sửa Core Values, danh sách cài đặt: đổi ngôn ngữ (EN/VI), Thông báo ("sắp ra mắt" — placeholder, **chưa hoạt động**), Xuất dữ liệu ("sắp ra mắt" — placeholder, **chưa hoạt động**), Đăng xuất. |
| `/entries/new` | Đã đăng nhập | Tạo nhật ký mới | Chọn mẫu gợi ý (template) hoặc viết tự do, gắn nhãn cảm xúc, nhập nội dung phản chiếu (reflection), lưu lại. |
| `/entries/edit/:id` | Đã đăng nhập | Sửa nhật ký | Sửa một entry đã tạo trước đó (cùng các trường như tạo mới). |
| `/onboarding` | Đã đăng nhập, chỉ hiện khi `onboardingCompleted = false` | Onboarding (2 bước) | **Bước 1:** chọn các giá trị cốt lõi (Core Values) từ danh sách cố định. **Bước 2:** thêm tối đa 5 người trong Bản đồ Mối quan hệ ban đầu. Cả 2 bước đều có thể bỏ qua (skip). Sau khi hoàn thành/skip, gọi 1 API duy nhất lưu toàn bộ và đánh dấu đã onboarding xong. |
| bất kỳ đường dẫn nào khác | — | 404 Not Found | Trang báo lỗi không tìm thấy. |

---

## 4. Tính năng theo module (đang hoạt động)

### 4.1. Xác thực (Authentication)
- Đăng nhập/đăng ký bằng **Google OAuth** (luồng auth-code — trao đổi code phía backend, an toàn hơn luồng chỉ dùng ID token).
- Đăng nhập/đăng ký bằng **tài khoản/mật khẩu** (họ tên, username, mật khẩu).
- JWT do backend tự phát hành, lưu trong `localStorage`.
- Khi gặp lỗi 401 (hết hạn/không hợp lệ): tự động xoá token, xoá cache dữ liệu, chuyển hướng về `/login`.

### 4.2. Onboarding (trải nghiệm lần đầu)
- Chạy đúng 1 lần cho tài khoản mới, dựa trên cờ `onboardingCompleted` của user.
- 2 bước: chọn Core Values → thêm tối đa 5 người quen ban đầu. Có thể bỏ qua từng bước.
- Nếu người dùng chưa hoàn thành onboarding mà cố truy cập trang khác, hệ thống tự chuyển hướng về `/onboarding`.

### 4.3. "Hôm nay" (Today) — trang chủ sau đăng nhập
- Màn hình chủ duy nhất sau khi đăng nhập, thay thế vai trò trung tâm của Dashboard cũ (mục 1.1, Giai đoạn 4). Không phải một tab trong nhiều tab ngang hàng — đây là nơi người dùng luôn quay về đầu tiên.
- Nội dung: lời chào theo khung giờ (sáng/chiều/tối) + chuỗi ngày liên tục ghi nhật ký; 1 câu gợi mở trò chuyện xoay vòng mỗi ngày (ổn định trong ngày, không lặp lại y hệt hôm sau) với 2 lối vào Trò chuyện ("Bắt đầu tại đây" mang theo câu gợi mở làm tin nhắn đầu, hoặc "Có chuyện khác đang nghĩ tới" vào chat trống); dải cột thể hiện cảm xúc nặng nhất mỗi ngày trong 7 ngày qua (tính từ nhãn cảm xúc trên các entry); danh sách "Tiếp tục từ đây" — tối đa 3 mục gần nhất (phiên chat đã kết thúc hoặc nhật ký), mới nhất trước; xem trước Tấm gương (số dòng đã "giữ lại" ở mỗi ô Cởi mở/Điểm mù/Giữ kín/Chưa rõ — xem mục 4.7); danh sách rút gọn tối đa 2 người "cần bạn để ý" từ Bản đồ Mối quan hệ (mục 4.6, kèm gợi ý nhắc nhở nếu có); lối tắt viết nhật ký một mình (không qua chat).
- Số liệu "Tuần này" (số phiên chat + số nhật ký trong 7 ngày) hiển thị cố định ở khung điều hướng bên trái (desktop).

### 4.4. Trò chuyện với Aura ("Talk")
- Khung chat 1-1 với AI (route `/coach`, tên hiển thị "Trò chuyện"), có thể bắt đầu phiên mới hoặc tiếp tục phiên đang mở (được nhớ qua `localStorage`).
- Gửi tin nhắn → nhận phản hồi từ AI (xem chi tiết cơ chế AI ở backend spec).
- **Dải "đang đọc tâm trạng" (mood-read ribbon):** hiển thị phía trên khung chat, ước lượng cảm xúc hiện tại từ chính các tin nhắn người dùng vừa gõ (quét từ khoá theo nhãn cảm xúc, tính toán **hoàn toàn phía frontend** — không phải phân tích cảm xúc bằng AI thật), thể hiện bằng 1 thanh trượt nhẹ→nặng và nhãn cảm xúc lúc mở đầu phiên. Chỉ mang tính gợi ý trực quan tức thời trong phiên, không được lưu lại.
- Có thể yêu cầu tóm tắt phiên (dạng văn bản markdown, hiển thị bằng renderer markdown).
- Kết thúc phiên (End session) — sau khi kết thúc, backend sẽ tự động phân tích và trích xuất thông tin (người được nhắc tới, sự kiện mối quan hệ, insight) — xem mục 4.6, 4.8.

### 4.5. "Catch" (giữ lại khoảnh khắc trong lúc chat)
- Panel bên cạnh màn hình chat (trước đây gọi "Insight Catcher"), cho phép người dùng **chủ động** (không phải AI tự động) giữ lại một đoạn tin nhắn/ý nghĩ, gửi đúng 1 trong 3 đích:
  1. **Vào Tấm gương** — chọn đúng 1 trong 4 ô Cởi mở/Điểm mù/Giữ kín/Chưa rõ để lưu dòng đó vào (xem mục 4.7).
  2. **Thành Ghi chú** — ghi chú tự do, có thể gắn tag, hiển thị lại ở tab Nhật ký (mục 4.9).
  3. **Vào Người** — thêm nhanh một người mới hoặc cập nhật một người đã có vào Bản đồ Mối quan hệ (mục 4.6), ngay từ trong lúc chat.
- **Đã thu gọn từ 5 loại khung xuống còn đúng 3 đích ở trên** (Giai đoạn 4) — bộ chọn khung cũ (Freeform/Johari/ACT Matrix/Personal SWOT/Life Positions) không còn trên giao diện; 3 loại khung ACT Matrix, Personal SWOT, Life Positions **không còn cách nào để tạo mới** qua UI (chỉ còn tồn tại nếu đã được tạo trước Giai đoạn 4 — xem mục 4.10, mục 8).

### 4.6. Bản đồ Mối quan hệ Cá nhân (Personal Relationship Map — PRM)
- Nay là tab **"Mọi người"** trong hub Thấu hiểu (`/reflect/people`); một bản rút gọn (tối đa 2 người) cũng xuất hiện trên "Hôm nay" (mục 4.3).
- Hiển thị dạng sơ đồ tia (SVG radial graph): nút trung tâm là "Bạn", các nút xung quanh là từng người (Person).
- Mỗi người có: tên, loại quan hệ (Gia đình/Bạn bè/Người yêu/Đồng nghiệp/Quản lý/Khác), ghi chú, thời điểm được nhắc tới gần nhất, và một **chỉ số sức khoẻ mối quan hệ (healthSignal, thang 0.0–1.0)** thể hiện bằng 3 mức màu (cần để ý / đang xa dần / ổn định), kèm gợi ý nhắc nhở (nudge text) nếu có.
- Có thể thêm người mới hoặc sửa thông tin người đã có (trực tiếp ở tab này, hoặc nhanh hơn qua "Catch" trong lúc chat — mục 4.5); xem danh sách insight liên quan tới từng người.

### 4.7. Tấm gương (Mirror — Johari Window thường trực)
- Nay là tab **"Tấm gương"** trong hub Thấu hiểu (`/reflect/mirror`); một bản xem trước (chỉ đếm số dòng mỗi ô) cũng xuất hiện trên "Hôm nay" (mục 4.3).
- Vẫn dựa trên khung Johari Window (4 ô: Cởi mở/Điểm mù/Giữ kín/Chưa rõ) nhưng **không còn là một form nhập 1 lần** — mỗi lần dùng "Catch" chọn "Vào Tấm gương" (mục 4.5) sẽ tạo **1 dòng mới** vào đúng 1 ô; Tấm gương gộp **tất cả** các dòng đã giữ lại theo từng ô qua thời gian, hiển thị theo dạng lưới 4 ô kèm số lượng dòng ở mỗi ô — tích luỹ dần qua nhiều phiên chat thay vì chỉ chụp 1 lần.
- Về mặt dữ liệu, mỗi dòng vẫn là 1 `SavedFrameworkEntry` loại `JOHARI_WINDOW` — chỉ khác cách tạo (mục 4.10).

### 4.8. Dòng thời gian Insight (Insight Timeline)
- Nay là tab **"Dòng thời gian"** trong hub Thấu hiểu (`/reflect/timeline`).
- Danh sách các "insight" **do AI tự động trích xuất** sau mỗi phiên chat (không phải người dùng tự nhập) — chỉ đọc.
- Mỗi insight thuộc 1 trong 3 nhóm: **Giá trị bản thân (VALUE)**, **Khuôn mẫu hành vi (BEHAVIOR_PATTERN)**, **Mối quan hệ (RELATIONSHIP)** — nhóm sau có thể gắn với một người cụ thể trong PRM.

### 4.9. Nhật ký (Journal) & Mẫu gợi ý (Templates)
- Nay là tab **"Nhật ký"** trong hub Thấu hiểu (`/reflect/journal`), gộp chung 2 nguồn nội dung trong 1 danh sách:
  1. **Entries** — nhật ký người dùng tự viết: tiêu đề, nội dung phản chiếu, gắn 1 hoặc nhiều nhãn cảm xúc (chọn từ danh sách cố định — xem mục 6). Có bộ lọc theo khoảng thời gian (hôm nay/tuần/tháng/năm/tất cả) + tìm kiếm theo tiêu đề/nội dung.
  2. **"Ghi chú"** (mục riêng bên dưới danh sách entries) — các `SavedFrameworkEntry` **không phải** Johari Window: chủ yếu là Ghi chú tự do được giữ lại qua "Catch" (mục 4.5), cộng với bất kỳ entry ACT Matrix/Personal SWOT/Life Positions nào đã được tạo **trước Giai đoạn 4** (khi bộ chọn khung cũ còn tồn tại) — các entry cũ này giờ **chỉ xem/xoá được, không sửa được** (form nhập nhiều khung đã bị gỡ khỏi UI). Johari Window **không** xuất hiện ở đây — nó chỉ hiển thị gộp trong tab Tấm gương (mục 4.7).
- 3 mẫu gợi ý câu hỏi dẫn dắt khi viết nhật ký mới: **Cuộc trò chuyện khó khăn**, **Tình huống mất năng lượng**, **Biết ơn/Thành công** — mỗi mẫu có 4 câu hỏi gợi ý.
- CRUD đầy đủ cho Entries: tạo, xem danh sách, sửa, xoá.

### 4.10. Saved Framework Entries ("Đúc kết" — dữ liệu nền cho Catch/Tấm gương/Nhật ký)
- Các mục người dùng tự lưu (khác với Insight ở mục 4.8 — Insight là AI tự trích xuất và chỉ đọc, còn mục này người dùng chủ động tạo/xoá được). Đây là model dữ liệu nền cho cả mục 4.7 (Tấm gương) lẫn phần "Ghi chú" của mục 4.9 (Nhật ký) — không còn màn hình danh sách riêng của nó.
- Nơi ghi dữ liệu vào duy nhất hiện nay là panel "Catch" trong lúc chat (mục 4.5): loại `JOHARI_WINDOW` → hiển thị gộp ở tab Tấm gương; loại `FREEFORM` → hiển thị ở phần "Ghi chú" của tab Nhật ký. `ACT_MATRIX`/`PERSONAL_SWOT`/`LIFE_POSITIONS` không còn được tạo mới (xem mục 4.5, mục 8).

### 4.11. Giá trị cốt lõi (Core Values)
- Bộ 12 giá trị cố định: Trung thực, Gia đình, Tự do, Sáng tạo, Kết nối, Trưởng thành, Cân bằng, Can đảm, Bình yên, Cống hiến, Thành tựu, Học hỏi.
- Người dùng chọn trong Onboarding, có thể xem/sửa lại sau ở trang "Tôi" (mục 4.12).

### 4.12. "Tôi" (You) — Hồ sơ & Cài đặt
- Trang Profile cũ, đổi tên hiển thị thành "Tôi" trong điều hướng chính (route vẫn là `/profile`).
- Sửa tên hiển thị, tải ảnh đại diện.
- Đổi mật khẩu (chỉ áp dụng cho tài khoản đăng ký bằng mật khẩu, không áp dụng cho tài khoản Google-only).
- Thống kê cá nhân tính toán **phía frontend** từ dữ liệu entries: số ngày liên tục ghi nhật ký (streak), cảm xúc xuất hiện nhiều nhất, biểu đồ phân bố cảm xúc.
- Xem/sửa Core Values, chuyển đổi ngôn ngữ EN/VI.
- Mục "Thông báo" và "Xuất dữ liệu": hiển thị nhãn "sắp ra mắt", **chưa có chức năng thật**.

### 4.13. Chống lạm dụng / Giới hạn tần suất (hiển thị UI)
- Khi backend trả lỗi 429 (vượt giới hạn), frontend phát 1 sự kiện toàn cục và hiển thị thông báo (snackbar) bằng tiếng Việt cho người dùng biết họ đã vượt hạn mức (ví dụ: số tin nhắn/số phiên chat AI cho phép).

### 4.14. Trang chủ công khai (Public Marketing Home)
- Dành cho khách chưa đăng nhập: hero + khối "6 điều Aura làm" minh hoạ tính năng — **Trò chuyện**, **Giữ lại** (Catch), **Tấm gương của bạn** (Mirror), **Những người trong đó** (People/PRM), **Dòng thời gian**, **Giá trị của bạn** (Core Values). Đây là **nội dung tĩnh/minh hoạ**, không phải dữ liệu thật của người dùng.

---

## 5. Tính năng đã có dữ liệu/model nhưng KHÔNG còn UI (dead / orphaned)

Các phần này còn tồn tại trong code (model dữ liệu, khoá đa ngôn ngữ) nhưng **không có màn hình, service hay hook nào gọi tới** — thuộc về giai đoạn sản phẩm cũ trước khi pivot. Liệt kê ở đây để tránh mất công redesign UI cho tính năng không còn tồn tại, hoặc để cân nhắc "hồi sinh" có chủ đích:

- **Theo dõi năng lượng (Energy Tracking):** model dữ liệu (mức 1–10, gắn ngữ cảnh: công việc/xã hội/nghỉ ngơi/vận động/sáng tạo/học tập/gia đình/một mình) và các khoá i18n liên quan (biểu đồ xu hướng, phân loại theo ngữ cảnh...) vẫn còn, nhưng không có trang hay component nào sử dụng. Đây là phần thuộc concept "Innerverse" cũ.
- **Kịch bản ứng phó (Action Protocol):** model dữ liệu (tình huống kích hoạt, kịch bản ứng phó, đánh giá hiệu quả) và khoá i18n liên quan vẫn còn nhưng không có UI.
- **Khu vườn / Trang "Phương pháp":** các khoá i18n liên quan tới ẩn dụ khu vườn và trang phương pháp luận cũ không còn route/trang tương ứng (đã bị xoá ở một đợt dọn dẹp code trước đây).
- **Nút Chat nổi toàn cục (FAB):** *(mới nghỉ hưu — Giai đoạn 4, mục 1.1)* trước đây xuất hiện ở mọi trang để mở nhanh Coach chat; đã bị gỡ bỏ khi điều hướng chính đổi thành 4 mục cố định Hôm nay/Trò chuyện/Thấu hiểu/Tôi — mục "Trò chuyện" trong điều hướng chính nay đóng vai trò lối vào chat luôn có mặt, không cần nút nổi riêng nữa.
- **Bộ chọn khung 5 loại của Insight Catcher (ACT Matrix / Personal SWOT / Life Positions):** *(mới nghỉ hưu — Giai đoạn 4)* panel "Catch" (tên mới của Insight Catcher, mục 4.5) chỉ còn 3 đích lưu (Tấm gương/Ghi chú/Người) — không còn form nhập cho 3 loại khung này. Các entry loại này **được tạo trước Giai đoạn 4 vẫn còn dữ liệu** và vẫn xem được (chỉ đọc, chỉ xoá được) ở phần "Ghi chú" trong tab Nhật ký (mục 4.9) — không bị xoá dữ liệu, chỉ không còn đường tạo mới.
- **`/dashboard` và `/entries/list` (route cũ):** không còn màn hình riêng — chỉ còn là redirect sang `/reflect/people` và `/reflect/journal` tương ứng, giữ lại để không làm hỏng bookmark/link cũ (xem mục 3).

> Lưu ý: backend (`reflectly-be`) **vẫn còn API đầy đủ cho Energy Logs và Action Protocol** (CRUD hoạt động bình thường) — chỉ riêng frontend là không còn dùng tới. Xem backend spec mục "Tính năng có ở BE nhưng FE không dùng".

---

## 6. Model dữ liệu phía Frontend (tóm tắt nghiệp vụ)

| Model | Ý nghĩa nghiệp vụ | Field chính |
|---|---|---|
| **User** | Tài khoản người dùng | `id, email, pictureUrl, fullName, hasPassword?, coreValues?, onboardingCompleted?` |
| **Person** | Một người trong Bản đồ Mối quan hệ | `id, name, relationshipType (FAMILY/FRIEND/PARTNER/COLLEAGUE/MANAGER/OTHER), notes?, lastMentionedAt?, daysSinceLastMention?, healthSignal (0–1), nudgeText?` |
| **Conversation** | Một phiên chat với Aura | `id, status (ACTIVE/ENDED/EXTRACTING/EXTRACTED/EXTRACTION_FAILED), startedAt, endedAt?, messages[], summary?` |
| **ConversationMessage** | Một tin nhắn trong phiên chat | `id, role (USER/ASSISTANT), content, createdAt` |
| **Insight** | Insight do AI tự động trích xuất (chỉ đọc) | `id, insightText, category (VALUE/BEHAVIOR_PATTERN/RELATIONSHIP), createdAt, personId?, personName?` |
| **SavedFrameworkEntry** | "Đúc kết" người dùng tự lưu/sửa | `id, frameworkType (FREEFORM/JOHARI_WINDOW/ACT_MATRIX/PERSONAL_SWOT/LIFE_POSITIONS), title?, payload, conversationId?, personId?, personName?, createdAt, updatedAt` (payload có cấu trúc riêng theo từng loại framework) |
| **Entry** | Nhật ký người dùng tự viết | `id, userId, title, reflection, emotions[], templateKey?, createdAt, updatedAt` |
| **Emotion** | Nhãn cảm xúc (enum cố định) | `happy, blessed, good, confused, bored, awkward, angry, anxious, down` — mỗi cảm xúc có icon/màu/nhãn/mô tả riêng |
| **EntryTemplate** | Mẫu gợi ý viết nhật ký | 3 mẫu: `difficult_conversation, energy_drain, gratitude_win`, mỗi mẫu 4 câu hỏi gợi ý |
| **EnergyLog / ActionProtocol** | *(đã chết, xem mục 5)* | — |

---

## 7. Tích hợp API (endpoint frontend đang gọi)

Base URL cấu hình qua biến môi trường `VITE_API_URL`. Mọi request kèm `Authorization: Bearer <token>`. Chi tiết đầy đủ về backend nằm ở [`reflectly-be/spec.md`](https://github.com/hankimthuy/reflectly-be/blob/main/spec.md); bảng dưới đây chỉ để tra cứu nhanh phía frontend gọi gì:

| Nhóm | Endpoint | Mục đích |
|---|---|---|
| Auth | `POST /auth/google`, `POST /auth/login`, `POST /auth/signup` | Đăng nhập Google / đăng nhập / đăng ký bằng tài khoản-mật khẩu |
| Người dùng | `GET/PUT /users/profile`, `PUT /users/password`, `POST /users/avatar`, `PUT /users/onboarding` | Xem/sửa hồ sơ, đổi mật khẩu, tải avatar, hoàn tất onboarding |
| Nhật ký | `GET/POST /entries`, `GET/PUT/DELETE /entries/:id` | CRUD nhật ký |
| Trò chuyện (Coach) | `POST /conversations`, `GET /conversations`, `GET /conversations/:id`, `POST /conversations/:id/messages`, `POST /conversations/:id/end`, `POST /conversations/:id/summarize` | Toàn bộ vòng đời một phiên chat Aura |
| Mối quan hệ | `GET/POST /people`, `PUT /people/:id` | Quản lý người trong PRM |
| Insight | `GET /insights` (lọc theo `personId`) | Xem dòng thời gian insight |
| Đúc kết | `GET/POST /saved-framework-entries`, `GET/PUT/DELETE /saved-framework-entries/:id` | CRUD saved framework entries |

---

## 8. Khoảng trống / placeholder / chưa hoàn thiện

Những điểm này đáng lưu ý khi redesign UI vì hiện đang là "chỗ trống" hoặc trải nghiệm chưa trọn vẹn:

- **Thông báo (Notifications)** và **Xuất dữ liệu (Export)** trong "Tôi": chỉ là placeholder gắn nhãn "sắp ra mắt", chưa có chức năng thật.
- **ACT Matrix, Personal SWOT, Life Positions**: có model dữ liệu ở cả FE/BE nhưng **không còn cách nào tạo mới qua UI** kể từ Giai đoạn 4 (panel "Catch" chỉ còn 3 đích: Tấm gương/Ghi chú/Người — xem mục 4.5, mục 5); các entry loại này tạo từ trước vẫn xem/xoá được (chỉ đọc) trong phần "Ghi chú" ở tab Nhật ký.
- **Dải "đang đọc tâm trạng" (mood-read ribbon) ở Trò chuyện**: chỉ là suy luận từ khớp từ khoá trên tin nhắn người dùng, tính toán phía frontend — **không phải phân tích cảm xúc bằng AI thật** và không được lưu lại sau khi rời trang. Đáng lưu ý nếu có kỳ vọng nó chính xác/khớp với insight do AI trích xuất (mục 4.8).
- **Avatar/hình đại diện cho từng người trong Bản đồ Mối quan hệ**: chưa có, hiện chỉ hiển thị theo tên/màu.
- **Logo/wordmark chính thức của thương hiệu "Aura Self AI"**: còn thiếu (theo tài liệu thiết kế nội bộ), linh vật "Aura" hiện dùng ảnh GIF tạm.
- **1 khoá i18n mồ côi:** `brand.contactLink` chỉ tồn tại trong `vi.json`, không có trong `en.json` và không thấy được dùng ở bất kỳ component nào — có thể xoá khỏi `vi.json` ở lần dọn dẹp tiếp theo.
- **Bộ lọc entries theo cảm xúc/khoảng ngày** ở service tầng dưới tồn tại nhưng chưa chắc được UI hiện tại sử dụng đầy đủ — tab Nhật ký hiện chỉ lọc theo khoảng thời gian cố định (hôm nay/tuần/tháng/năm) + tìm kiếm theo chữ, chưa có lọc theo nhãn cảm xúc trên UI.

---

## 9. Ghi chú về tài liệu cũ trong repo (KHÔNG dùng làm nguồn sự thật)

Các file sau đã lỗi thời, mô tả sản phẩm ở giai đoạn "MimoSe" garden-journal trước khi pivot — **không phản ánh đúng hiện trạng**, chỉ giữ lại làm tư liệu lịch sử:

- `README.md` — riêng bảng danh sách route (`/entries`, `/statistics`, `/quotes`, `/innerverse`, `/outerverse`, `/mimo-method`) đã lỗi thời; các phần khác (setup, deploy) vẫn dùng được.
- `documentation/02-Integration/API-Contracts.md` — mô tả endpoint hoàn toàn khác thực tế (`/energy-log`, `/journal/entries`, `/social-orbit`, `/tasks`, `/goals`, base `/api/v1`); README cũng tự ghi chú file này "Outdated — use `src/services/` instead".
- `documentation/MimoSe-copy-audit.md` — audit nội dung/copy của bản concept "khu vườn" cũ, mang tính lịch sử.
- `documentation/01-UX-UI-Specs/Design-System.md` — mô tả brand & design system giai đoạn trước Giai đoạn 4 ("Aura Self — Brand & Design System", hệ token `coach-*`). Sau lần tái cấu trúc IA + làm mới giao diện ở Giai đoạn 4 (mục 1.1, mục 2), **các giá trị token màu/typography cụ thể trong tài liệu này không còn khớp với hệ thống thực tế** (`src/styles/tailwind.css` mới) — chỉ phần mô tả giọng văn thương hiệu/nguyên tắc UX chung còn giá trị tham khảo.

Nguồn sự thật cho tài liệu này: code trong `src/routes/`, `src/pages/`, `src/models/`, `src/services/`.

---

## 10. Update Log

| Ngày (UTC) | Tác giả | Nội dung cập nhật |
|---|---|---|
| 2026-09-06 | Claude (agent) | Khởi tạo `spec.md` — khảo sát toàn bộ codebase frontend hiện tại (routes, features, data models, API, tài liệu cũ) và viết tài liệu nghiệp vụ đầy đủ lần đầu tiên. |
| 2026-09-10 | Claude (agent) | Cập nhật `spec.md` cho Giai đoạn 4 — tái cấu trúc IA "Aura" (nhánh `redesign/aura-hearth`, PR #95, đã merge vào `main`): điều hướng 4 mục Hôm nay/Trò chuyện/Thấu hiểu/Tôi thay cho 4-tab + FAB cũ; Dashboard + danh sách nhật ký gộp thành hub "Thấu hiểu" (People/Mirror/Timeline/Journal); Johari Window thành bề mặt thường trực "Tấm gương"; "Insight Catcher" đổi tên "Catch", rút gọn còn 3 đích lưu (bỏ ACT Matrix/Personal SWOT/Life Positions khỏi UI tạo mới); thêm dải "đang đọc tâm trạng" ở Trò chuyện; `/dashboard` và `/entries/list` thành redirect. Cập nhật mục 1, 2, 3, 4, 5, 8, 9. Không có thay đổi model dữ liệu hay endpoint backend. (Không mô tả chi tiết bộ nhận diện trực quan "Hearth" — màu/font/bo góc — vì đó là thay đổi thuần hình ảnh, không phải nghiệp vụ; xem PR liên quan để biết chi tiết thị giác.) |
| 2026-09-10 | Claude (agent) | Đổi ngôn ngữ mặc định của app từ Tiếng Việt sang **Tiếng Anh** (`src/i18n/index.ts`: `lng`/`fallbackLng` mặc định khi chưa có lựa chọn lưu trong `localStorage`; `index.html` `<html lang>`), theo yêu cầu người dùng (nhánh `chore/default-locale-en`). Khảo sát lại 2 file `en.json`/`vi.json` cho thấy cả 2 đã gần như đồng bộ hoàn toàn theo key (677 vs 678, chỉ lệch 1 khoá mồ côi) — sửa lại nhận định cũ ở mục 1 và mục 8 rằng tiếng Anh "chưa đầy đủ". Không đổi nội dung bản dịch, không đổi model dữ liệu/endpoint. |
