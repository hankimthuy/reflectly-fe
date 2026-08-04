# Toàn bộ nội dung hiện có trong MimoSe — Copy audit

Nguồn: `reflectly-fe/src/i18n/locales/vi.json`, nhánh `integration/phase-1c`. Liệt kê nguyên văn mọi chuỗi tiếng Việt đang hiển thị trong app, theo đúng thứ tự xuất hiện trên từng màn hình — để đối chiếu wording với tài liệu khoa học lãnh đạo bản thân và kiểm tra tính nhất quán của phương pháp Mimo.

**Chú giải:**
- **● core** — nơi mang tư tưởng/khoa học lãnh đạo bản thân, nên soi kỹ nhất
- **● UI** — nhãn nút, thông báo, placeholder — ít liên quan tới nội dung khoa học

## Mục lục

1. Thương hiệu & Hero trang chủ — core
2. Bản đồ khu vườn (6 zone) — core
3. Cầu nối hành động (panel mới) — core
4. Khung tư duy 3 bước + 4 nguyên tắc — core
5. Trang Phương pháp — core
6. Điều hướng & nhãn chung — UI
7. Năng lượng (log · lịch sử · bảng thông tin) — UI
8. Nhật ký & mẫu gợi ý viết — UI
9. Kịch bản ứng phó (Action Protocol) — UI
10. Hồ sơ, vùng cảm xúc & trang khác — UI

---

## 1. Thương hiệu & Hero trang chủ — core

Đây là câu đầu tiên user đọc — khung quy chiếu cho toàn bộ giọng điệu app.

- **brand.name · brand.acronym** — MimoSe — *Make Sense Of ME*
- **brand.slogan (h1)** — "Làm rõ chính mình"
- **brand.description** — "Khu vườn tâm trí nơi bạn nhận ra mình đang cảm thấy gì, nghĩ gì, và cần gì — trước khi phản ứng với thế giới bên ngoài."
- **brand.tagline** *(không còn hiển thị trên Hero sau redesign — vẫn còn trong file)* — "Nhận thức bản thân, từng ngày một."
- **garden.quote** *(đã bỏ khỏi Hero, giữ trong file)* — "Tôi không thể kiểm soát người khác, nhưng tôi luôn kiểm soát được cách mình lắng nghe và chọn lọc."
- **brand.footer** — "© 2026 MimoSe — Make Sense Of ME. Khoa học nhận thức và lãnh đạo bản thân."
- **brand.welcome** *(chưa thấy nơi nào render key này)* — "Chào mừng trở lại khu vườn của bạn."

## 2. Bản đồ khu vườn — 6 vùng — core

garden.mapTitle: "Ngôi nhà tâm trí của tôi" · garden.mapSubtitle: "Chọn một vùng trong vườn để khám phá và làm rõ chính mình."

- **garden.zones.mind** — Tâm trí — "Ngôi nhà trung tâm — nơi bạn quay về để hiểu mình."
- **garden.zones.reflection** — Tự chiêm nghiệm — "Nơi bạn ghi lại và nhìn lại những gì đang diễn ra bên trong."
- **garden.zones.creativity** *(sắp mở)* — Sáng tạo — "Biến hiểu biết thành biểu đạt — viết, vẽ, tạo hình những gì bạn cảm nhận."
- **garden.zones.connection** *(sắp mở)* — Kết nối & Mối quan hệ — "Nhìn lại mạng lưới quan hệ — ai nuôi dưỡng và ai cạn kiệt bạn."
- **garden.zones.emotion** — Cảm xúc — "Nhận diện cảm xúc — bước đầu tiên để hiểu mình."
- **garden.zones.filter** — Bộ lọc bên trong — "Chọn điều gì để tin, giữ, và mang về ngôi nhà tâm trí." *(zone này trỏ route tới trang Phương pháp)*
- **garden.legend** — "Đi ra trải nghiệm" · "Quay về phục hồi"

## 3. Cầu nối hành động — panel mới trên trang chủ — core

Chỉ hiện khi đã đăng nhập, nằm giữa bản đồ khu vườn và khung tư duy 3 bước.

- **garden.bridge.heading / subtitle** — "Cầu nối hành động của bạn" — "Ba bước nhỏ để biến nhận thức thành hành động."
- **garden.bridge.energy** — Năng lượng hôm nay — mẫu câu: "Gần nhất: mức {level} · {days} ngày trước" / "…· hôm nay". Rỗng: "Chưa có bản ghi nào — bắt đầu với 1 chạm". Nút: "Xem lịch sử"
- **garden.bridge.protocols** — Kịch bản của bạn — "{count} kịch bản đang sẵn sàng". Rỗng: "Chưa có kịch bản nào — tạo cái đầu tiên". Nút: "Xem kịch bản"
- **garden.bridge.dashboard** — Nhìn lại hành trình — "Xem xu hướng 7 ngày qua". Nút: "Xem bảng thông tin"

## 4. Khung tư duy 3 bước + 4 nguyên tắc vận hành — core

garden.framework.* — hiện bản rút gọn (không nút, không nguyên tắc) trên trang chủ; bản đầy đủ trên trang Phương pháp (mục 5).

### garden.framework.goOut — "Tôi ra ngoài như thế nào?"

"Trước khi bước ra thế giới bên ngoài, tôi dừng lại kiểm tra năng lượng và cảm xúc của mình — đây là Lớp 1 Nội tâm (Innerverse)."

1. Ghi nhanh mức năng lượng hiện tại (1-10) trước khi bắt đầu
2. Gắn nhãn cảm xúc đang có, không phán xét đúng hay sai
3. Nhận ra mẫu hình — hoạt động nào khiến năng lượng tăng, hoạt động nào khiến cạn kiệt
4. Chọn cách tham gia phù hợp với trạng thái thật của mình lúc này

Link (chỉ ở trang Phương pháp): "Xem năng lượng của bạn"

### garden.framework.comeBack — "Tôi quay về như thế nào?"

"Khi gặp tình huống khó, tôi dùng Kịch bản ứng phó (Action Protocol) — lõi USP của MimoSe — thay vì phản ứng ngẫu hứng."

1. Viết kịch bản ứng phó trước, khi đầu óc còn bình tĩnh
2. Dùng đúng kịch bản đã chuẩn bị ngay khi tình huống xảy ra
3. Đánh dấu đã dùng và ghi lại kết quả
4. Theo dõi độ hiệu quả theo thời gian và điều chỉnh kịch bản nếu cần

Link (chỉ ở trang Phương pháp): "Xem kịch bản ứng phó của bạn"

### garden.framework.filter — "Tôi nhìn lại như thế nào?"

"Bảng thông tin và biểu đồ xu hướng (Lớp 5 Thấu hiểu & Phát triển) cho tôi thấy các mẫu hình theo thời gian — để tôi tự nhận ra, không phải app kết luận thay tôi."

1. Xem lại biểu đồ xu hướng năng lượng theo ngày, theo tuần
2. So sánh mức năng lượng giữa các hoạt động khác nhau
3. Nhận ra thời điểm năng lượng thường xuống thấp nhất
4. Tự rút ra điều gì đang lặp lại — quyết định tiếp theo là của mình

Link (chỉ ở trang Phương pháp): "Xem bảng thông tin của bạn"

### garden.framework.principlesTitle — "Bốn nguyên tắc vận hành"

| Nguyên tắc | Mô tả |
|---|---|
| Đồng hành, không lý thuyết | Mỗi tính năng gắn với một hành động cụ thể — không phải bài đọc lý thuyết. |
| Tự giải quyết | Công cụ gợi ý khung câu hỏi, không đưa lời khuyên thay bạn. |
| Protocol có vòng đời | Kịch bản ứng phó được theo dõi và xem lại theo thời gian, không dùng một lần rồi bỏ. |
| Tiện lợi tại đúng khoảnh khắc | Ưu tiên thao tác 1-2 chạm, đặc biệt trong những lúc căng thẳng. |

## 5. Trang Phương pháp (/phuong-phap) — core

Trang tập trung nhiều nhất khung khoa học lãnh đạo bản thân — nên đọc kỹ toàn bộ mục này.

- **phuongPhapPage.hero.badge** — "Cơ sở khoa học lãnh đạo bản thân"
- **phuongPhapPage.hero.title (h1)** — "Vì sao MimoSe *vận hành như vậy*"
- **phuongPhapPage.hero.subtitle** — "MimoSe được xây dựng theo nguyên lý Leading Self: bạn cần hiểu và dẫn dắt chính mình trước khi dẫn dắt người khác. Trang này giải thích cơ sở đằng sau từng tính năng bạn đang dùng."
- **phuongPhapPage.layers.title / subtitle** — "Bốn lớp MimoSe đã có" — "Mỗi tính năng bạn dùng đều thuộc một lớp trong mô hình lãnh đạo bản thân."
- **phuongPhapPage.layers.items.foundation** — Lớp 0 · Nền tảng — "Tài khoản, hồ sơ và nhật ký — nơi mọi dữ liệu của bạn bắt đầu."
- **phuongPhapPage.layers.items.innerverse** — Lớp 1 · Nội tâm (Innerverse) — "Theo dõi năng lượng và gắn nhãn cảm xúc — hiểu điều đang diễn ra bên trong."
- **phuongPhapPage.layers.items.bridge** — Lớp 3 · Cầu nối hành động (Bridge) — "Kịch bản ứng phó — lõi USP biến hiểu biết thành hành động cụ thể."
- **phuongPhapPage.layers.items.insight** — Lớp 5 · Thấu hiểu & Phát triển (Insight & Growth) — "Bảng thông tin và biểu đồ xu hướng — nhìn lại chặng đường đã qua."

  > **Lưu ý:** Lớp 2 (Outerverse) và Lớp 4 (Companion) chưa được liệt kê ở đây vì chưa build — nếu tài liệu khoa học cần nhắc tới, bổ sung dạng "sắp có".

- **phuongPhapPage.cta** — "Sẵn sàng áp dụng?" — "Bắt đầu bằng ghi nhận đầu tiên của bạn — một dòng nhật ký, một mức năng lượng, hay một kịch bản ứng phó." — nút "Bắt đầu ghi nhận"

## 6. Điều hướng & nhãn chung — UI

- **nav.garden / reflection / emotion** — Khu vườn · Tự chiêm nghiệm · Cảm xúc
- **nav.energy / dashboard / protocols / journal** — Năng lượng · Bảng thông tin · Kịch bản · Nhật ký
- **nav.method / profile** — Phương pháp · Tôi
- **nav.groupSpaces / groupJourney** — Không gian · Hành trình của bạn *(nhãn cụm header)*
- **nav.login / startJourney** — Đăng nhập · Bắt đầu hành trình
- **breadcrumb.*** — Khu vườn · Tự chiêm nghiệm · Cảm xúc · Nhật ký · Hồ sơ · Phương pháp
- **mobileFooter.*** — Vườn · Nhật ký · Cảm xúc · Năng lượng · Tôi
- **mobileFooter.authDialog** — "Yêu cầu Đăng nhập" — "Bạn cần đăng nhập để tạo hoặc xem các bài viết của mình."

## 7. Năng lượng — log nhanh · lịch sử · bảng thông tin — UI

- **energyLog.quickLogTitle** — "Năng lượng của bạn lúc này thế nào?" — thang 1-10, "Bạn đang làm gì?" (context tag)
- **energyHistoryPage.title / subtitle** — "Lịch sử năng lượng" — "Ghi lại nhanh mức năng lượng của bạn theo thời gian."
- **dashboard.title / subtitle** — "Bảng thông tin Năng lượng" — "Xem năng lượng của bạn thay đổi theo thời gian và ở đâu."
- **dashboard.trend / byContext / byCount** — "Xu hướng năng lượng" · "Năng lượng theo hoạt động" · "Số lần ghi theo hoạt động"
- **dashboard.summary** — "Mức trung bình" · "Tổng số bản ghi" · "Hoạt động năng lượng cao nhất"

## 8. Nhật ký & mẫu gợi ý viết — UI

- **newEntryPage.title / subtitle** — "Góc tự chiêm nghiệm" — "Ngay lúc này — bạn đang cảm thấy thế nào?"
- **newEntryPage.emotionQuestion** — "Điều gì đang hiện diện trong bạn?" — "Chọn những gì cộng hưởng. Không có đáp án sai."
- **newEntryPage.reflectionStep / save** — "Nói Lên Sự Thật" — nút "Lưu Khoảnh Khắc" — "Riêng tư & mã hóa"
- **entryTemplates.picker** — "Bạn muốn có gợi ý không?" — "Chọn một chủ đề để có gợi ý nhẹ nhàng, hoặc viết tự do."

### entryTemplates.templates.difficult_conversation — "Cuộc trò chuyện khó"

Gỡ rối một cuộc trò chuyện đang khiến bạn trăn trở.

1. Điều gì đã xảy ra, theo lời của bạn?
2. Bạn cảm thấy thế nào trong và sau cuộc trò chuyện?
3. Bạn ước mình đã nói hoặc làm khác đi điều gì?
4. Một bước nhỏ nào bạn có thể thực hiện từ đây?

### entryTemplates.templates.energy_drain — "Cạn năng lượng"

Nhận diện điều đang khiến năng lượng của bạn suy giảm.

1. Điều gì đã khiến bạn cạn năng lượng hôm nay?
2. Bạn nhận thấy điều đó ở đâu trong cơ thể hoặc tâm trạng?
3. Nhu cầu nào của bạn chưa được đáp ứng?
4. Một điều gì đó có thể giúp bạn hồi phục năng lượng?

### entryTemplates.templates.gratitude_win — "Biết ơn / Thành công"

Tận hưởng một điều tốt đẹp, dù lớn hay nhỏ.

1. Điều gì đã diễn ra tốt đẹp hôm nay, dù là điều nhỏ nhặt?
2. Bạn đang biết ơn ai hoặc điều gì ngay lúc này?
3. Bạn đã làm điều gì khiến bạn tự hào?
4. Làm sao để bạn giữ cảm giác này tiếp diễn?

---

- **entriesPage.title / subtitle** — "Nhật ký tự chiêm nghiệm" — "Mỗi dòng nhật ký là một bước để làm rõ chính mình."
- **entriesPage.emptyState / laoTzuQuote** — "Can đảm để bắt đầu là can đảm để trưởng thành." — "Hành trình vạn dặm bắt đầu từ một bước chân — bước đi của bạn bắt đầu ngay tại đây."

## 9. Kịch bản ứng phó (Action Protocol) — UI

- **actionProtocol.list.title / subtitle** — "Kịch bản ứng phó" — "Những kịch bản ứng phó bạn viết sẵn, dùng ngay khi cần."
- **actionProtocol.form** — Tiêu đề · "Tình huống kích hoạt" (VD: Khi tôi cảm thấy quá tải trong công việc) · "Các bước ứng phó"
- **actionProtocol.markUsed.title / subtitle** — "Kết quả thế nào?" — "Đánh giá mức độ hiệu quả của kịch bản lần này."
- **actionProtocol.effectiveness** — Hiệu quả · Hiệu quả một phần · Không hiệu quả

## 10. Hồ sơ, vùng cảm xúc & trang khác — UI

- **profilePage.title** — "Khu vườn của tôi" — thống kê: "Chuỗi ngày", "Cảm xúc chính"
- **emotionPage.title / subtitle** — "Hồ sen cảm xúc" — "Nhận diện và theo dõi mẫu hình cảm xúc — bước đầu tiên để hiểu mình."
- **zonePage.comingSoon / backToGarden** — "Vùng này đang được chăm sóc. Hãy quay lại sau." — "Về khu vườn"
- **notFound.title / subtitle** — "Bạn đã đi lạc khỏi vườn" — "Trang này không tồn tại trong khu vườn tâm trí."
- **auth.*** — Đăng nhập · Tạo tài khoản · Tên đăng nhập · Mật khẩu · "Tiếp tục với Google"

---

## Ghi chú nguồn

Nguồn: `reflectly-fe/src/i18n/locales/vi.json`, nhánh `integration/phase-1c` (đã merge qua PR #80–#82, chờ review PR #83 → develop). Bản tiếng Anh (`en.json`) hiện chưa đầy đủ ở các namespace `garden`, `phuongPhapPage`, `zonePage`, `emotionPage`, `notFound`, `auth` — nếu cần đối chiếu song ngữ, cần bổ sung riêng.
