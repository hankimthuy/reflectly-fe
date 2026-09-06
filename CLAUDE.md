# Hướng dẫn cho agent làm việc trên repo này

## Duy trì `spec.md` (bắt buộc)

`spec.md` ở repo này là **tài liệu nghiệp vụ sống** (living business/BA documentation) mô tả toàn bộ sản phẩm phía frontend: màn hình, tính năng, luồng nghiệp vụ, model dữ liệu, API đang gọi. Nó được dùng làm nguồn tham chiếu để redesign UI và để hiểu nhanh hiện trạng sản phẩm — vì vậy nó **phải luôn phản ánh đúng code hiện tại**, không phải kế hoạch/kỳ vọng.

Có một tài liệu song song ở backend: `reflectly-be/spec.md` (API, database, business logic, AI Coach engine).

### Sau khi hoàn thành bất kỳ thay đổi nào ảnh hưởng đến:
- một route/màn hình mới, bị xoá, hoặc đổi hành vi đáng kể;
- một tính năng mới được thêm, hoặc một tính năng cũ bị gỡ/vô hiệu hoá;
- model dữ liệu phía frontend (`src/models/*`);
- danh sách endpoint mà frontend gọi tới (`src/services/*`);
- quy tắc nghiệp vụ quan trọng (ví dụ: quyền truy cập, điều kiện gating, giới hạn tần suất...);

→ agent **phải**:

1. Mở `spec.md`, tìm đúng phần bị ảnh hưởng, và cập nhật cho khớp hiện trạng mới. Không chỉ thêm — nếu một tính năng/route đã bị xoá hoặc thay đổi, phải sửa/xoá nội dung cũ tương ứng, không để tài liệu nói sai.
2. Nếu một tính năng đang hoạt động trở thành "chết"/không còn UI dùng (như các mục ở phần 5 của spec.md hiện tại), chuyển mục đó sang đúng phần "tính năng đã chết" thay vì xoá thẳng thông tin.
3. Thêm một dòng mới vào bảng **Update Log** ở cuối `spec.md`: ngày (UTC, định dạng `YYYY-MM-DD`), tác giả (ví dụ "Claude (agent)"), mô tả ngắn gọn 1 câu về thay đổi và (nếu có) số PR/commit liên quan.
4. Nếu thay đổi có ảnh hưởng chéo sang backend (ví dụ đổi endpoint, đổi field trả về), cân nhắc ghi chú tương ứng cũng cần cập nhật ở `reflectly-be/spec.md` (không bắt buộc tự sửa repo kia, nhưng nên nhắc trong PR description nếu áp dụng).

### Không bắt buộc cập nhật khi:
- refactor thuần kỹ thuật không đổi hành vi người dùng quan sát được (đổi tên biến, tách component, tối ưu hiệu năng...);
- sửa lỗi nhỏ không ảnh hưởng luồng nghiệp vụ mô tả trong spec.md.

### Nguyên tắc viết
- Giữ văn phong hiện có của `spec.md` (tiếng Việt, mô tả nghiệp vụ, không lẫn chi tiết code/triển khai trừ khi cần thiết để làm rõ).
- Chỉ cập nhật phần bị ảnh hưởng — không viết lại toàn bộ tài liệu trong một lần sửa.
- Nếu phát hiện một phần của `spec.md` đã sai/lỗi thời trong lúc làm việc khác (dù không liên quan trực tiếp tới thay đổi của mình), nên sửa luôn hoặc ít nhất ghi chú lại trong Update Log.
