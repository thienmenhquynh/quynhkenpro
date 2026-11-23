# 9Proptech · Design system v2.1 · Foundation 9tek

**Nền tảng** — shadcn/ui (New York) · Tailwind CSS v4 · Lucide. Theme: Light (mặc định), Dark, Tương phản cao (`hc`), Tương phản cao Dark (`hc-dark`).

## Tổng quan

9Proptech là hệ thống thiết kế cho ứng dụng nội bộ của đội kinh doanh bất động sản — **Hôm nay, Trợ lý AI, Drive, CRM** — và landing page dự án. Nền tảng là **shadcn/ui (New York) trên Tailwind CSS v4 + Lucide**, tô màu bằng **Foundation 9tek**. Thiết kế mobile-first; Light là theme mặc định cho màn hình nghiệp vụ, Dark được định nghĩa đầy đủ, kèm hai theme **Tương phản cao** (`hc`, `hc-dark`) cho người cần độ tương phản lớn.

Bản cài đặt cho codebase (globals.css Tailwind v4, `components.json`, lệnh thêm component) nằm ở mục **Tailwind v4 + shadcn/ui**.

### Nguyên tắc

- **Một CTA chính mỗi ngữ cảnh.** `Button` `default` (`primary`) cho hành động chính; `outline` hoặc `secondary` cho hành động phụ; `ghost` cho icon và điều hướng; `destructive` chỉ cho hủy/xóa và luôn qua `Dialog` xác nhận.
- **Dùng component gốc, chỉnh bố cục bằng utility.** Không viết lại màu, viền, radius hay focus ring của component; chỉ thêm utility cho khoảng cách, độ rộng và vùng chạm.
- **Trạng thái dùng cả chữ và màu.** Mọi trạng thái nghiệp vụ là `Badge` có chữ (*Mới*, *Đã đặt lịch*, *Cần xác nhận*, *Quá hạn*); lỗi form có icon `circle-alert` và câu hướng dẫn.
- **Lime và cyan là nhận diện, không phải trạng thái.** `brand-lime`, `brand-cyan` và `brand-gradient` chỉ xuất hiện trong `BrandMark` và hero landing.
- **Dữ liệu giả trong wireframe.** Tên, số điện thoại, giá trong ví dụ là minh họa bố cục.

### Nội dung và giọng văn

- Tiếng Việt có dấu đầy đủ, câu ngắn, xưng hô trung tính với nhân viên (*bạn*), lịch sự với khách trên landing (*Anh/Chị*).
- Viết hoa chữ đầu câu cho nút, tiêu đề, nhãn: *Đặt lịch xem*, *Lead chưa giao*. Không viết hoa toàn bộ.
- Nút là động từ + đối tượng: *Gọi khách*, *Tải tài liệu lên*, *Chuyển Trưởng phòng xác nhận*.
- Lỗi nói cách sửa: *Nhập số điện thoại 10 chữ số.* — không *Sai định dạng*.
- Trạng thái rỗng nói việc làm tiếp: *Chưa có tài liệu — Tải bảng giá, mặt bằng hoặc pháp lý để Trợ lý AI trả lời theo dự án.*
- Số theo kiểu Việt Nam: `4.200.000.000 đ`, `4,2 tỷ`, `2,4 MB`; ngày `22/11/2026`, giờ `09:42`. Luôn đặt `tabular-nums` (`.pt-num`) cho số liệu, số điện thoại, ngày giờ khi căn cột.
- Không dùng emoji trong giao diện nghiệp vụ.

### Màu

Token trùng tên biến của shadcn/ui, nên `bg-primary`, `text-muted-foreground`, `border-border`… dùng được ngay sau khi dán globals.css.

- Nền ứng dụng `background`; thẻ, bảng, thanh điều hướng `card`; menu, toast, popover `popover` (ánh xạ về `card`).
- Chữ chính `foreground` trên `background`, `card`, `muted`, `secondary` (≥16:1). Metadata và mô tả `muted-foreground` (≥7:1 trên cùng các nền).
- CTA `primary` với chữ `primary-foreground`: teal đậm `#0E7490` ở Light để giữ 5,4:1 với chữ trắng; cyan `#2EE4FF` ở Dark với chữ `#05161A`.
- `accent` / `accent-foreground` cho tab đang chọn, mục điều hướng đang chọn, nền hội thoại AI, hover của ghost/outline.
- `destructive` cho hủy/xóa và lỗi; chữ trên nền destructive dùng `destructive-foreground`.
- Viền thẻ `border`; viền ô nhập `input`; focus `ring`.
- Biểu đồ dùng `chart-1` → `chart-5` theo thứ tự cố định (teal, cam, tím, vàng, hồng), đã kiểm tra mù màu ở cả hai theme. Màu đi theo thực thể, không theo thứ hạng; chữ trên biểu đồ luôn dùng `foreground`/`muted-foreground`. `chart-4` Light chỉ 2,1:1 trên nền nên `Chart` luôn kèm legend, tooltip và nút *Xem bảng*.

**Cặp màu cần lưu ý (giữ nguyên giá trị nguồn):**
- `input` chỉ đạt ~1,3:1 trên `card` — dưới mức 3:1 cho viền điều khiển. Luôn có `Label` hiển thị phía trên ô nhập; ô nhập còn có `shadow-xs` làm mốc.
- `destructive` làm chữ trên `background` Dark đạt ~4:1. Giữ chữ lỗi ≥14px medium và luôn kèm icon.

### Theme tương phản cao

Hai theme bổ sung, không thay thế Light/Dark của thương hiệu: **`hc`** (nền trắng) và **`hc-dark`** (nền đen). Bật khi người dùng chọn trong cài đặt hoặc khi hệ thống báo `prefers-contrast: more`; theo `prefers-color-scheme` để chọn `hc` hay `hc-dark`.

- Mọi màu chữ đạt **≥7:1** trên các nền ghi trong ghi chú token (WCAG AAA): `foreground` 18,7:1 / 21:1, `muted-foreground` ≥10:1 / ≥9:1, `primary-foreground` 8,5:1 / 14,8:1, `accent-foreground` 9,5:1.
- Viền `border` và `input` **≥4:1** trên mọi bề mặt; bề mặt và điều khiển tách nhau bằng viền, không chỉ bằng sắc độ. Nút `secondary`, Badge, TabsList, Alert, menu, toast có viền 1px.
- Focus ring dày **3px**, ≥7:1.
- Trạng thái đang chọn (tab, toggle, mục điều hướng, mục Command, khoảng ngày) có thêm viền trong 2px `accent-foreground`; mục điều hướng đáy được gạch chân.
- Link luôn gạch chân. Card bỏ bóng, giữ viền.
- `destructive` chữ lỗi 8,2:1 (hc) / 8,3:1 (hc-dark); ở `hc-dark` nút xóa dùng chữ đen trên đỏ sáng.
- Biểu đồ: mọi chuỗi ≥3:1 trên nền (`chart-4` đổi sang `#9A6700` ở `hc`), vẫn qua kiểm tra mù màu.
- Gradient và lime/cyan nhận diện giữ nguyên; không dùng làm nền chữ.
- Chế độ Windows `forced-colors` dùng màu hệ thống cho viền và trạng thái chọn.

### Chữ

- **Lexend** (`--font-heading`) cho tiêu đề và nhận diện; **Mona Sans** (`--font-body`) cho nội dung, form, điều hướng; **Be Vietnam Pro** là font dự phòng trong cả hai stack. Cả ba tải từ Google Fonts.
- `page-title` 22px/1.25 semibold — một lần mỗi màn hình mobile.
- `section-title` 18px và `section-title-sm` 16px semibold cho tiêu đề mục, CardTitle, tiêu đề Dialog/Sheet.
- `body` 14/20 mặc định; `body-long` 16/24 cho câu trả lời AI, mô tả dự án và **mọi ô nhập trên mobile** (16px tránh iOS tự zoom; `Input` tự chuyển về 14px từ 768px).
- `label` 14/20 medium cho nhãn và chữ nút; `caption` / `caption-medium` 12/16 cho phụ chú, Badge, nhãn điều hướng đáy.
- `stat` 24px và `stat-sm` 20px semibold cho số liệu nổi bật, luôn kèm `tabular-nums`.
- Kiểm tra nhãn có dấu (*Nguyễn Thị Hồng*, *Quận 7*) ở mọi cỡ; tên file dài cắt bằng `text-overflow: ellipsis`, không xuống dòng giữa từ.

### Khoảng cách, radius, bóng

- Nhịp 4px: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32.
- Lề mobile `space-4`. Khoảng cách giữa khối `space-4`–`space-6`. Padding thẻ `space-4` (`Card`) hoặc `space-3` (`Card size="compact"`) — thay cho 24px mặc định của shadcn.
- Vùng chạm tối thiểu `touch-target` 44×44 cho điều hướng, nút icon và CTA trên mobile: đặt prop `touch` trên `Button` (hoặc utility `min-h-11 min-w-11`). Không đổi màu, viền, radius, focus ring khi tăng vùng chạm.
- Radius cơ sở `radius` 0.625rem; `radius-sm` 6 (mục menu), `radius-md` 8 (Button, Input, Badge), `radius-lg` 10 (Alert, Dialog, Tabs), `radius-xl` 14 (Card, Sheet đáy).
- Bóng: `shadow-xs` cho control, `shadow-sm` cho Card, `shadow-md` cho menu/popover, `shadow-lg` cho Dialog/Sheet/Toast. Tách lớp bằng viền `border` trước, bóng sau.

### Trạng thái và tương tác

- **Focus:** viền liền 2px `ring`, offset 2px, trên mọi control (3,5:1 ở Light, 15:1 ở Dark). Đây là điều chỉnh có chủ đích so với ring 3px 50% của shadcn để đạt 3:1.
- **Hover:** `primary` 90%; ghost/outline sang `accent`; hàng bảng `muted` 50%.
- **Disabled:** opacity 50%, không nhận chạm.
- **Lỗi:** `aria-invalid` → viền `destructive` + quầng 20%; thông điệp qua `FormField error`.
- **Tải:** `Skeleton` khớp kích thước thật; `Progress` kèm tên file và phần trăm bằng chữ.
- **Chuyển động:** 150–200ms ease-out cho mở overlay và đổi trạng thái; tất cả tắt khi `prefers-reduced-motion`.
- **Đóng/quay lại nhất quán:** mọi `Dialog`/`Sheet` có nút `x` 44px góc phải, đóng bằng Esc và chạm nền.

### Bố cục và điều hướng

- Mobile: `BottomNav` **Hôm nay · AI · CRM · Drive**, nhãn dưới icon, mục hiện tại nền `accent`, chừa `safe-area-inset-bottom`.
- Desktop (≥1024px): `SidebarNav` 256px với cùng mục, cùng nhãn và cùng cách gọi chức năng.
- Landing page: điều hướng riêng cho khách, CTA *Đăng ký tư vấn* cố định ở đáy khi phù hợp.
- CRM: mobile dùng thẻ hồ sơ có tác vụ *Gọi* / *Đặt lịch*; desktop dùng `Table` để đối chiếu.

### Mẫu theo module

| Màn hình | Component | Hành vi chính |
|---|---|---|
| **Hôm nay** | `Card interactive`, `Button`, `Badge` | Chạm thẻ để mở lead chưa giao, lịch xem hoặc việc tiếp theo. |
| **AI** | `Select`, `Input`, `Button`, `Card`, `Popover`, `Alert` | Chọn dự án, hỏi, mở trích dẫn đã cấp quyền. Thiếu nguồn → `Alert` với *Chuyển Trưởng phòng xác nhận*. |
| **Drive** | `Input`, `Button`, `Card`, `Sheet`, `Progress`, `Breadcrumb` | Tìm, tải nhiều file, mở chi tiết và phiên bản trong `Sheet` đáy. Luôn hiện tên file, loại file, trạng thái xử lý. |
| **CRM** | `Card`, `Badge`, `Button`, `Sheet`, `Table`, `Tabs`, `Pagination` | Thẻ hồ sơ trên mobile, bảng trên desktop. |
| **Landing** | `Button`, `Card`, `Accordion`, `Dialog` hoặc form | Xem dự án, mở mặt bằng, đăng ký tư vấn. |
| **Phản hồi hệ thống** | `Alert`, `Skeleton`, `Spinner`, `Empty`, `Toaster`, `AlertDialog` | Tải, rỗng, lỗi, thành công, xác nhận xóa. |
| **Báo cáo (desktop)** | `Chart`, `DataTable`, `DatePicker`, `Combobox`, `Resizable`, `Menubar` | Lead theo nguồn, doanh số, đối chiếu danh sách có sắp xếp và chọn hàng. |
| **Đặt lịch & xác thực** | `Calendar`, `DatePicker`, `InputOTP`, `Slider` | Chọn ngày xem nhà (chặn ngày đã qua), nhập OTP, lọc ngân sách/diện tích. |

Trang **ModulePatterns** dựng bốn màn hình mobile bằng chính các component này.

### Icon

- **Lucide** (stroke 2, 24×24, `currentColor`), cỡ 16px trong nút và menu, 20px trong điều hướng.
- Bundle đóng gói sẵn 35 icon từ `lucide-static@0.460.0` (xem component `Icon`); codebase dùng `lucide-react`.
- Icon đứng một mình phải có `aria-label`; không dùng emoji thay icon.

### Nhận diện

- `brand-gradient` = `linear-gradient(100deg, #DEFEFF 0%, #2EE4FF 48%, #A2FF00 100%)`, chỉ dùng trong `BrandMark` và hero landing.
- Nguồn chưa kèm file logo: `BrandMark` hiện là dấu hiệu chữ (thanh gradient + "9Proptech" Lexend semibold). Thay bằng SVG logo chính thức khi có.
- CTA trên nền sáng luôn là teal đậm `primary`, không bao giờ cyan hay lime.

### Bổ sung có chủ đích

Ngoài bảng token nguồn, hệ thống thêm các phần còn thiếu để khớp chuẩn shadcn/ui:
- `popover`, `sidebar-*`: ánh xạ (alias) về `card`, `primary`, `accent`, `border`, `ring` — không thêm màu mới.
- `destructive-foreground` `#FFFFFF`: shadcn v4 dùng chữ trắng trên destructive.
- `radius-sm/md/lg/xl`, `shadow-xs…lg`: giá trị mặc định của shadcn v4 suy ra từ `--radius`.
- Badge `accent`, Card `size="compact"`/`interactive`, `FormField`, `Empty`, `BottomNav`, `SidebarNav`, `BrandMark`: phục vụ các màn hình trong phạm vi.
- `Select` dựng trên `<select>` gốc để dùng bộ chọn hệ thống trên mobile.

### Danh mục component

- **Hành động:** Button, ButtonGroup, Toggle, ToggleGroup, DropdownMenu.
- **Form:** Label, Input, InputGroup, InputOTP, Textarea, FormField, Select, Combobox, Checkbox, Switch, RadioGroup, Slider, Calendar, DatePicker.
- **Bố cục:** Card, Separator, Table, Accordion, Collapsible, Tabs, AspectRatio, Carousel, ScrollArea, Resizable.
- **Hiển thị dữ liệu:** Badge, Avatar, Progress, Skeleton, Icon, Kbd, Chart, DataTable.
- **Phản hồi:** Alert, Empty, Spinner, Toaster.
- **Lớp phủ:** Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, ContextMenu, Command.
- **Điều hướng:** BottomNav, SidebarNav, Menubar, NavigationMenu, Breadcrumb, Pagination.
- **Nhận diện:** BrandMark.

Ánh xạ shadcn: `Drawer` = Sheet đáy (vaul), `Combobox` = Popover + Command, `DatePicker` = Popover + Calendar, `DataTable` = Table + sắp xếp/chọn/phân trang (TanStack trong codebase). `Field`/`Form` của shadcn tương ứng `FormField`; `Sonner` tương ứng `Toaster`.

### Kiểm tra trước khi áp dụng

- Bề rộng 320, 390, 430px; cỡ chữ hệ thống lớn; desktop; khi bàn phím ảo mở.
- Nhãn có dấu, tên file dài, focus bằng bàn phím, lỗi form, trạng thái rỗng.
- Cả bốn theme — Light, Dark, `hc`, `hc-dark` — cho mọi màn hình mới.

## Token màu

| Token | Light | Dark | Tương phản cao | Tương phản cao · Dark | Dùng cho |
|---|---|---|---|---|---|
| `--background` | `#F8FAFC` | `#0F1113` | `#FFFFFF` | `#000000` | Nền ứng dụng (body, màn hình). Chữ `foreground` và `muted-foreground` đọc trên nền này. |
| `--foreground` | `#0F172A` | `#E6EEF0` | `#0B1220` | `#FFFFFF` | Chữ chính trên `background`, `card`, `muted`, `secondary`. 17:1 (Light), 16:1 (Dark). Tương phản cao: 18,7:1 (hc), 21:1 (hc-dark). |
| `--card` | `#FFFFFF` | `#1D2126` | `#FFFFFF` | `#0D0F12` | Bề mặt thẻ (Card), bảng, thanh điều hướng đáy. |
| `--card-foreground` | `{foreground}` | `{foreground}` | `{foreground}` | `{foreground}` | Chữ trên `card`. |
| `--popover` | `{card}` | `{card}` | `{card}` | `{card}` | Bề mặt menu, popover, toast, option của Select. Ánh xạ về `card` (bổ sung theo chuẩn shadcn). |
| `--popover-foreground` | `{foreground}` | `{foreground}` | `{foreground}` | `{foreground}` | Chữ trên `popover`. |
| `--primary` | `#0E7490` | `#2EE4FF` | `#0A5468` | `#5CEBFF` | CTA chính (Button default), checkbox/radio/switch đang bật, thanh Progress. Một CTA chính mỗi ngữ cảnh. |
| `--primary-foreground` | `#FFFFFF` | `#05161A` | `#FFFFFF` | `#000000` | Chữ và icon trên `primary`. 5,4:1 (Light), 12:1 (Dark). Tương phản cao: 8,5:1 (hc), 14,8:1 (hc-dark). |
| `--secondary` | `#EEF2F7` | `#1F2328` | `#E6EBF2` | `#1A1E23` | Nút phụ (Button secondary), Badge secondary. |
| `--secondary-foreground` | `#0F172A` | `#E6EEF0` | `#0B1220` | `#FFFFFF` | Chữ trên `secondary`. |
| `--muted` | `#F1F5F9` | `#181B1F` | `#EEF2F6` | `#14171B` | Bề mặt nhẹ: nền TabsList, hàng bảng khi hover, ô icon của Empty. |
| `--muted-foreground` | `rgb(15 23 42 / .74)` | `rgb(230 238 240 / .72)` | `#2B3445` | `#D5DDE0` | Metadata, mô tả, placeholder. ≥7:1 trên `background`, `card`, `muted`, `secondary` ở cả hai theme. Tương phản cao: ≥10:1 (hc), ≥9:1 (hc-dark) trên mọi nền. |
| `--accent` | `#E0F8FC` | `#0F3640` | `#D3F3F9` | `#003845` | Tab đang chọn, mục điều hướng đang chọn, nền hội thoại AI nhẹ, hover của ghost/outline, Skeleton. |
| `--accent-foreground` | `#0E7490` | `#2EE4FF` | `#064152` | `#7FF0FF` | Chữ và icon trên `accent`. 4,8:1 (Light), 8,4:1 (Dark). Tương phản cao: 9,5:1 trên `accent` ở cả hai theme. |
| `--destructive` | `oklch(.577 .245 27.325)` | `oklch(.577 .245 27.325)` | `#9B1C14` | `#FF7B72` | Hủy hoặc xóa (Button/Badge destructive), viền và chữ lỗi form. Cùng giá trị ở Dark theo nguồn: chữ lỗi trên `background` Dark chỉ đạt ~4:1 — giữ chữ lỗi ≥14px medium và luôn kèm icon. Tương phản cao: chữ lỗi 8,2:1 (hc) và 8,3:1 (hc-dark) trên `background`; hc-dark dùng chữ đen trên nền đỏ sáng. |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#000000` | Chữ trên `destructive` (4,8:1). Bổ sung: shadcn v4 dùng text-white cho variant destructive. |
| `--border` | `rgb(15 23 42 / .10)` | `rgb(140 154 160 / .18)` | `#5B6575` | `#8A949E` | Viền thẻ, đường kẻ bảng, Separator. Viền trang trí — không dùng để phân biệt trạng thái. Tương phản cao: ≥4:1 trên mọi bề mặt — viền tách lớp, không chỉ dựa vào sắc độ. |
| `--input` | `#D9E1EC` | `#2C3138` | `#5B6575` | `#8A949E` | Viền trường nhập, checkbox, radio, nền switch tắt. Giá trị nguồn chỉ ~1,3:1 trên `card` (dưới 3:1 cho viền điều khiển): luôn đặt Label phía trên ô nhập. Tương phản cao: ≥4,9:1 (hc), ≥5,4:1 (hc-dark) — đạt 3:1 cho viền điều khiển. |
| `--ring` | `#0891B2` | `#A5F3FC` | `#0A5468` | `#7FF0FF` | Focus ring 2px liền, offset 2px. 3,5:1 trên `background`/`card` (Light), 15:1 (Dark). Tương phản cao: ≥7:1 trên mọi bề mặt. |
| `--sidebar` | `{card}` | `{card}` | `{card}` | `{card}` | Nền sidebar desktop. Ánh xạ về `card`. |
| `--sidebar-foreground` | `{foreground}` | `{foreground}` | `{foreground}` | `{foreground}` | Chữ trên `sidebar`. |
| `--sidebar-primary` | `{primary}` | `{primary}` | `{primary}` | `{primary}` | CTA trong sidebar. |
| `--sidebar-primary-foreground` | `{primary-foreground}` | `{primary-foreground}` | `{primary-foreground}` | `{primary-foreground}` | Chữ trên `sidebar-primary`. |
| `--sidebar-accent` | `{accent}` | `{accent}` | `{accent}` | `{accent}` | Mục sidebar đang chọn. |
| `--sidebar-accent-foreground` | `{accent-foreground}` | `{accent-foreground}` | `{accent-foreground}` | `{accent-foreground}` | Chữ trên `sidebar-accent`. |
| `--sidebar-border` | `{border}` | `{border}` | `{border}` | `{border}` | Viền sidebar. |
| `--sidebar-ring` | `{ring}` | `{ring}` | `{ring}` | `{ring}` | Focus trong sidebar. |
| `--chart-1` | `#0891B2` | `#1597B5` | `#0086A8` | `#1597B5` | Chuỗi dữ liệu 1 (teal). Thứ tự cố định chart-1→5, không xoay vòng; màu theo thực thể, không theo thứ hạng. |
| `--chart-2` | `#EB6834` | `#D95926` | `#C2410C` | `#D95926` | Chuỗi dữ liệu 2 (cam). |
| `--chart-3` | `#6250D6` | `#9085E9` | `#5B45D6` | `#9085E9` | Chuỗi dữ liệu 3 (tím). |
| `--chart-4` | `#EDA100` | `#C98500` | `#9A6700` | `#C98500` | Chuỗi dữ liệu 4 (vàng). Light chỉ 2,1:1 trên nền: luôn có legend, tooltip và chế độ Xem bảng. Tương phản cao: thay bằng #9A6700 (4,9:1) để mọi chuỗi ≥3:1. |
| `--chart-5` | `#D55181` | `#D55181` | `#B8326B` | `#D55181` | Chuỗi dữ liệu 5 (hồng). Chuỗi thứ 6 trở lên gộp vào “Khác” hoặc tách biểu đồ nhỏ. |
| `--brand-cyan-50` | `#DEFEFF` | `#DEFEFF` | `#DEFEFF` | `#DEFEFF` | Điểm đầu gradient nhận diện. Chỉ dùng trong dấu hiệu thương hiệu. |
| `--brand-cyan` | `#2EE4FF` | `#2EE4FF` | `#2EE4FF` | `#2EE4FF` | Cyan nhận diện (điểm giữa gradient). Không dùng làm chữ trên nền sáng (1,6:1). |
| `--brand-lime` | `#A2FF00` | `#A2FF00` | `#A2FF00` | `#A2FF00` | Lime nhận diện (điểm cuối gradient). Chỉ cho nhận diện, không dùng cho trạng thái nghiệp vụ. |

## Kiểu chữ

| Style | Họ chữ | Cỡ | Line-height | Weight | Dùng cho |
|---|---|---|---|---|---|
| `page-title` | heading | 22px | 1.25 | 600 | Tiêu đề trang mobile, một lần mỗi màn hình. |
| `section-title` | heading | 18px | 24px | 600 | Tiêu đề mục, tiêu đề Dialog/Sheet. |
| `section-title-sm` | heading | 16px | 22px | 600 | Tiêu đề mục dày đặc, CardTitle. |
| `stat` | heading | 24px | 32px | 600 | Số liệu nổi bật. Luôn kèm `tabular-nums`. |
| `stat-sm` | heading | 20px | 28px | 600 | Số liệu nổi bật trong thẻ nhỏ. Luôn kèm `tabular-nums`. |
| `body` | body | 14px | 20px | 400 | Nội dung mặc định. |
| `body-long` | body | 16px | 24px | 400 | Nội dung đọc dài (câu trả lời AI, mô tả dự án) và ô nhập trên mobile (tránh iOS tự zoom). |
| `label` | body | 14px | 20px | 500 | Label, chữ trên Button, tiêu đề Alert. |
| `caption` | body | 12px | 16px | 400 | Phụ chú, metadata, dữ liệu phụ. |
| `caption-medium` | body | 12px | 16px | 500 | Badge, nhãn điều hướng đáy. |

- `--font-heading`: "Lexend", "Be Vietnam Pro", system-ui, sans-serif
- `--font-body`: "Mona Sans", "Be Vietnam Pro", system-ui, sans-serif

## Khoảng cách

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--space-1` | `4px` | Bước cơ sở 4 px. Khoảng cách icon–chữ trong Badge. |
| `--space-2` | `8px` | Khoảng cách giữa nút, giữa label và ô nhập. |
| `--space-3` | `12px` | Padding thẻ dày đặc (Card compact), khoảng cách trong form. |
| `--space-4` | `16px` | Lề mobile mặc định, padding thẻ, khoảng cách giữa khối tối thiểu. |
| `--space-5` | `20px` | Khoảng cách giữa khối trung bình. |
| `--space-6` | `24px` | Khoảng cách giữa khối lớn, padding Dialog. |
| `--space-8` | `32px` | Khoảng trống trạng thái rỗng, desktop. |
| `--touch-target` | `44px` | Vùng chạm tối thiểu cho điều hướng, nút icon và CTA trên mobile (prop `touch`). |

## Radius

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius` | `0.625rem` | Radius cơ sở shadcn (10 px). Các bậc dưới suy ra từ đây. |
| `--radius-sm` | `6px` | calc(var(--radius) - 4px): mục menu, nút đóng toast. |
| `--radius-md` | `8px` | calc(var(--radius) - 2px): Button, Input, Select, Badge, Tooltip. |
| `--radius-lg` | `10px` | var(--radius): Alert, Dialog, TabsList, Toast. |
| `--radius-xl` | `14px` | calc(var(--radius) + 4px): Card, Sheet đáy. |

## Bóng

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Button, Input, Checkbox. |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Card, tab đang chọn. |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | DropdownMenu, Popover, Card khi hover. |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Dialog, Sheet, Toast. |

## Gradient

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--brand-gradient` | `linear-gradient(100deg, #DEFEFF 0%, #2EE4FF 48%, #A2FF00 100%)` | Chỉ trong dấu hiệu thương hiệu (BrandMark, hero landing). Không dùng làm nền nút hay nền chữ. |

## Tailwind v4 + shadcn/ui

Cài đặt Foundation 9tek vào một dự án Next.js / Vite dùng Tailwind CSS v4 và shadcn/ui (style **new-york**, base color tùy chọn — biến bên dưới ghi đè).

### 1. Khởi tạo

```bash
npx shadcn@latest init
```

`components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "slate", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "iconLibrary": "lucide"
}
```

### 2. Thêm component

```bash
npx shadcn@latest add button input textarea label select checkbox switch radio-group card badge avatar separator table skeleton progress accordion tabs alert dialog alert-dialog sheet dropdown-menu popover tooltip sonner toggle-group breadcrumb pagination form \
  toggle button-group input-group input-otp kbd spinner slider calendar command collapsible hover-card context-menu drawer scroll-area aspect-ratio carousel menubar navigation-menu resizable chart empty field item
```

### 3. Font

```tsx
// app/layout.tsx
import { Lexend, Mona_Sans, Be_Vietnam_Pro } from "next/font/google";
const lexend = Lexend({ subsets: ["latin", "vietnamese"], variable: "--font-lexend" });
const mona = Mona_Sans({ subsets: ["latin", "vietnamese"], variable: "--font-mona" });
const beVietnam = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-be-vietnam" });
// <html lang="vi" className={`${lexend.variable} ${mona.variable} ${beVietnam.variable}`}>
```

Nếu `Mona_Sans` chưa có subset `vietnamese` trong phiên bản next/font của bạn, giữ `latin`: chữ có dấu sẽ rơi về Be Vietnam Pro trong stack.

### 4. app/globals.css

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: #F8FAFC;
  --foreground: #0F172A;
  --card: #FFFFFF;
  --card-foreground: #0F172A;
  --popover: #FFFFFF;
  --popover-foreground: #0F172A;
  --primary: #0E7490;
  --primary-foreground: #FFFFFF;
  --secondary: #EEF2F7;
  --secondary-foreground: #0F172A;
  --muted: #F1F5F9;
  --muted-foreground: rgb(15 23 42 / .74);
  --accent: #E0F8FC;
  --accent-foreground: #0E7490;
  --destructive: oklch(.577 .245 27.325);
  --destructive-foreground: #FFFFFF;
  --border: rgb(15 23 42 / .10);
  --input: #D9E1EC;
  --ring: #0891B2;
  --chart-1: #0891B2;
  --chart-2: #EB6834;
  --chart-3: #6250D6;
  --chart-4: #EDA100;
  --chart-5: #D55181;
  --sidebar: #FFFFFF;
  --sidebar-foreground: #0F172A;
  --sidebar-primary: #0E7490;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #E0F8FC;
  --sidebar-accent-foreground: #0E7490;
  --sidebar-border: rgb(15 23 42 / .10);
  --sidebar-ring: #0891B2;
  --brand-cyan-50: #DEFEFF;
  --brand-cyan: #2EE4FF;
  --brand-lime: #A2FF00;
  --brand-gradient: linear-gradient(100deg, #DEFEFF 0%, #2EE4FF 48%, #A2FF00 100%);
}

.dark {
  --background: #0F1113;
  --foreground: #E6EEF0;
  --card: #1D2126;
  --card-foreground: #E6EEF0;
  --popover: #1D2126;
  --popover-foreground: #E6EEF0;
  --primary: #2EE4FF;
  --primary-foreground: #05161A;
  --secondary: #1F2328;
  --secondary-foreground: #E6EEF0;
  --muted: #181B1F;
  --muted-foreground: rgb(230 238 240 / .72);
  --accent: #0F3640;
  --accent-foreground: #2EE4FF;
  --border: rgb(140 154 160 / .18);
  --input: #2C3138;
  --ring: #A5F3FC;
  --chart-1: #1597B5;
  --chart-2: #D95926;
  --chart-3: #9085E9;
  --chart-4: #C98500;
  --chart-5: #D55181;
  --sidebar: #1D2126;
  --sidebar-foreground: #E6EEF0;
  --sidebar-primary: #2EE4FF;
  --sidebar-primary-foreground: #05161A;
  --sidebar-accent: #0F3640;
  --sidebar-accent-foreground: #2EE4FF;
  --sidebar-border: rgb(140 154 160 / .18);
  --sidebar-ring: #A5F3FC;
}

@theme inline {
  --font-heading: var(--font-lexend), var(--font-be-vietnam), system-ui, sans-serif;
  --font-sans: var(--font-mona), var(--font-be-vietnam), system-ui, sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-brand-cyan-50: var(--brand-cyan-50);
  --color-brand-cyan: var(--brand-cyan);
  --color-brand-lime: var(--brand-lime);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --spacing-touch: 44px;
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-sans text-sm; }
  h1, h2, h3, h4 { @apply font-heading; }
  input, select, textarea { @apply text-base md:text-sm; }
}

@utility tabular { font-variant-numeric: tabular-nums; }
@utility bg-brand-gradient { background-image: var(--brand-gradient); }
```

### 5. Điều chỉnh theo hệ thống

Giữ mã registry gốc; chỉ thêm utility ở nơi dùng.

| Quy tắc | Cách làm trong Tailwind |
|---|---|
| Vùng chạm 44px trên mobile | `<Button className="min-h-touch md:min-h-0">`; nút icon `size-11 md:size-9` |
| Padding thẻ 12–16px | `<Card className="gap-4 py-4">` + `CardHeader/Content/Footer className="px-4"`; dày đặc `py-3 px-3 gap-3` |
| Focus ring liền 3:1 | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` thay `ring-ring/50 ring-[3px]` |
| Tab đang chọn dùng accent | `TabsTrigger className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"` |
| Số liệu căn cột | `tabular` hoặc `tabular-nums` |
| Tiêu đề | `font-heading text-[22px] leading-tight font-semibold` (page), `font-heading text-lg font-semibold` (mục) |
| Sheet đáy mobile | `<SheetContent side="bottom" className="rounded-t-xl pb-[env(safe-area-inset-bottom)]">` |
| Lịch tuần bắt đầu Thứ Hai | `<Calendar locale={vi} weekStartsOn={1} />` (`import { vi } from "date-fns/locale"`) |
| Biểu đồ | `ChartContainer config={{ fb: { label: "Facebook", color: "var(--chart-1)" } }}`; luôn kèm `ChartLegend`, `ChartTooltip` và bảng dữ liệu thay thế |
| Tìm không phân biệt dấu (Command/Combobox) | `filter={(v, s) => fold(v).includes(fold(s)) ? 1 : 0}` với `fold = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase()` |
| Điều hướng đáy | `fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] grid grid-cols-4 bg-card border-t` |

### 6. Theme tương phản cao

Thêm vào `globals.css`, sau khối `.dark`. Bật bằng class `hc` hoặc `hc-dark` trên `<html>` (lưu lựa chọn của người dùng), hoặc tự động theo `prefers-contrast: more`.

```css
@custom-variant hc (&:is(.hc *, .hc-dark *));

.hc {
  --background: #FFFFFF; --foreground: #0B1220; --card: #FFFFFF; --card-foreground: #0B1220; --popover: #FFFFFF; --popover-foreground: #0B1220;
  --primary: #0A5468; --primary-foreground: #FFFFFF; --secondary: #E6EBF2; --secondary-foreground: #0B1220;
  --muted: #EEF2F6; --muted-foreground: #2B3445; --accent: #D3F3F9; --accent-foreground: #064152;
  --destructive: #9B1C14; --destructive-foreground: #FFFFFF; --border: #5B6575; --input: #5B6575; --ring: #0A5468;
  --chart-1: #0086A8; --chart-2: #C2410C; --chart-3: #5B45D6; --chart-4: #9A6700; --chart-5: #B8326B;
  --sidebar: #FFFFFF; --sidebar-foreground: #0B1220; --sidebar-primary: #0A5468; --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #D3F3F9; --sidebar-accent-foreground: #064152; --sidebar-border: #5B6575; --sidebar-ring: #0A5468;
}

.hc-dark {
  --background: #000000; --foreground: #FFFFFF; --card: #0D0F12; --card-foreground: #FFFFFF; --popover: #0D0F12; --popover-foreground: #FFFFFF;
  --primary: #5CEBFF; --primary-foreground: #000000; --secondary: #1A1E23; --secondary-foreground: #FFFFFF;
  --muted: #14171B; --muted-foreground: #D5DDE0; --accent: #003845; --accent-foreground: #7FF0FF;
  --destructive: #FF7B72; --destructive-foreground: #000000; --border: #8A949E; --input: #8A949E; --ring: #7FF0FF;
  --chart-1: #1597B5; --chart-2: #D95926; --chart-3: #9085E9; --chart-4: #C98500; --chart-5: #D55181;
  --sidebar: #0D0F12; --sidebar-foreground: #FFFFFF; --sidebar-primary: #5CEBFF; --sidebar-primary-foreground: #000000;
  --sidebar-accent: #003845; --sidebar-accent-foreground: #7FF0FF; --sidebar-border: #8A949E; --sidebar-ring: #7FF0FF;
}

@layer base {
  :is(.hc, .hc-dark) *:focus-visible { @apply outline-3 outline-offset-2 outline-ring; }
  :is(.hc, .hc-dark) a { @apply underline underline-offset-3; }
}
```

`.hc-dark` cần cả biến thể `dark:` — đặt `class="dark hc-dark"` trên `<html>`.

| Quy tắc | Cách làm trong Tailwind |
|---|---|
| Viền cho bề mặt chỉ tách bằng sắc độ | `hc:border hc:border-border` trên Button secondary, Badge, TabsList, Alert, menu |
| Trạng thái đang chọn | `hc:data-[state=active]:ring-2 hc:data-[state=active]:ring-inset hc:data-[state=active]:ring-accent-foreground` |
| Card không bóng | `hc:shadow-none` |
| Bật theo hệ thống | `matchMedia("(prefers-contrast: more)")` → thêm `hc` hoặc `dark hc-dark` theo `prefers-color-scheme` |

## Component

### Accordion

Các mục thu gọn được — câu hỏi thường gặp trên landing, nhóm thông tin dự án.

**Consumer cung cấp:** `items` `[{value, title, content}]`, `type` (`single` | `multiple`), `defaultValue`, `collapsible`.

### Alert

Thông báo nội tuyến về trạng thái hệ thống.

**Consumer cung cấp:** `title`, `children` (mô tả), `variant` (`default` | `destructive`), `icon` (tên Lucide hoặc `null`), `action` (nút).

- Trợ lý AI thiếu nguồn: `Alert` default với `action` *Chuyển Trưởng phòng xác nhận*.
- Lỗi upload hoặc lưu: `destructive`, nói rõ cách khắc phục.

### AlertDialog

Hộp thoại xác nhận bắt buộc chọn (không đóng khi chạm nền) cho thao tác không hoàn tác được.

**Consumer cung cấp:** như `Dialog`; `footer` gồm nút Hủy (`outline`) và nút hành động (`destructive` khi xóa).

### AspectRatio

Giữ khung theo tỉ lệ cố định cho ảnh phối cảnh, mặt bằng, video.

**Consumer cung cấp:** `ratio` (mặc định 16/9), `children` (thường `<img>` có `alt`).

### Avatar

Ảnh đại diện tròn, fallback chữ viết tắt trên `accent`.

**Consumer cung cấp:** `src`, `alt`, `fallback` (2 chữ cái), `size` (px, mặc định 32).

### Badge

Nhãn trạng thái ngắn. Trạng thái nghiệp vụ luôn có chữ rõ nghĩa, màu chỉ hỗ trợ.

**Consumer cung cấp:** `children` (1–3 từ), `variant`: `default` · `secondary` · `outline` · `destructive` · `accent`.

- `accent` (bổ sung) cho trạng thái mới/đang chọn; `destructive` cho quá hạn hoặc lỗi.
- Không dùng lime hay cyan nhận diện làm màu trạng thái.

### BottomNav

Thanh điều hướng nội bộ mobile: **Hôm nay · AI · CRM · Drive**, nhãn dưới icon, trạng thái hiện tại bằng nền `accent` và chữ đậm.

**Consumer cung cấp:** `items` `[{value, label, icon, badge?}]`, `value`/`defaultValue`, `onValueChange`, `fixed` (dính đáy).

- Mỗi mục ≥44×44 (cao 52px), chừa `safe-area-inset-bottom`.
- `badge` là số đếm, `tabular-nums`, nền `destructive`.
- Desktop (≥1024px) chuyển sang `SidebarNav` với cùng mục và cùng nhãn.

### BrandMark

Dấu hiệu nhận diện: thanh `brand-gradient` + tên **9Proptech** bằng Lexend semibold.

**Consumer cung cấp:** `size` (`default` | `lg`), `name`.

- Nguồn không kèm file logo; đây là dấu hiệu chữ dựng từ token. Khi có logo chính thức, thay bằng file SVG trong nhóm asset Logos.
- Gradient chỉ xuất hiện ở đây và hero landing.

### Breadcrumb

Đường dẫn vị trí trong Drive và trang chi tiết desktop.

**Consumer cung cấp:** `items` `[{label, href?, onClick?}]`; mục cuối là trang hiện tại.

- Mobile: chỉ hiện cấp cha gần nhất kèm nút quay lại.

### Button

Nút hành động theo shadcn/ui New York; một CTA `default` mỗi ngữ cảnh.

**Consumer cung cấp:** `children` (chữ, có thể kèm `Icon`), `onClick`, `variant`, `size`, và `touch` trên mobile.

| Prop | Giá trị | Mặc định |
|---|---|---|
| `variant` | `default` · `secondary` · `outline` · `ghost` · `link` · `destructive` | `default` |
| `size` | `default` (36px) · `sm` (32px) · `lg` (40px) · `icon` (36×36) | `default` |
| `touch` | `true` nâng vùng chạm lên `touch-target` (44px) mà giữ màu, viền, radius | `false` |

- `default` (`primary`) cho hành động chính duy nhất: *Đặt lịch xem*, *Gửi câu hỏi*, *Tải lên*.
- `outline` hoặc `secondary` cho hành động phụ đặt cạnh CTA chính.
- `ghost` cho nút icon và điều hướng; `size="icon"` bắt buộc có `aria-label`.
- `destructive` chỉ cho hủy/xóa, luôn đi qua `Dialog` xác nhận.
- Trên mobile đặt `touch` cho CTA và nút icon. Chữ trên nút viết hoa chữ đầu câu, không viết hoa toàn bộ.

### ButtonGroup

Nhóm nút liền viền cho các hành động cùng đối tượng.

**Consumer cung cấp:** `children` (các `Button` cùng `variant`), `orientation` (`horizontal` | `vertical`), `label`.

- Chỉ ghép nút có cùng mức độ ưu tiên; CTA chính đứng riêng.

### Calendar

Lịch tháng, tuần bắt đầu Thứ Hai, chọn một ngày hoặc một khoảng.

**Consumer cung cấp:** `mode` (`single` | `range`), `selected`/`defaultSelected` (`Date` hoặc `{from, to}`), `onSelect`, `disablePast`, `disabled(date)`, `today`.

- Dùng cho đặt lịch xem nhà; `disablePast` để chặn ngày đã qua.

### Card

Bề mặt nhóm nội dung; trên mobile là đơn vị chính của Hôm nay và CRM.

**Consumer cung cấp:** cấu trúc `Card` › `CardHeader` (`CardTitle`, `CardDescription`, `CardAction`) › `CardContent` › `CardFooter`.

| Prop | Giá trị |
|---|---|
| `size` | `default` (padding 16px, gap 16px) · `compact` (12px) |
| `interactive` | `true`: cả thẻ chạm được, có `role="button"`, Enter/Space, hover viền `primary` |

- Padding 12–16px theo nguồn (thay cho 24px mặc định của shadcn); radius `radius-xl`; viền `border`; `shadow-sm`.
- Thẻ Hôm nay là `interactive`: chạm để mở lead chưa giao, lịch xem hoặc việc tiếp theo.
- Không thêm viền màu một bên; trạng thái dùng `Badge` có chữ.

### Carousel

Trượt ngang qua các slide (ảnh dự án, căn mẫu) bằng cuộn có điểm dừng; có nút Trước/Sau và vị trí `n / tổng`.

**Consumer cung cấp:** `items` (mảng node), `slideWidth` (mặc định `85%` để lộ slide kế tiếp trên mobile), `label`.

### Chart

Biểu đồ cột, đường, vùng cho báo cáo lead và doanh số. Màu chuỗi lấy theo thứ tự cố định `chart-1` → `chart-5`.

**Consumer cung cấp:** `type` (`bar` | `line` | `area`), `data` (mảng đối tượng), `xKey`, `series` `[{key, label}]`, `title`, `subtitle`, `height`, `valueFormat`, `axisFormat`, `label` (mô tả cho trình đọc màn hình).

- Một trục Y, bắt đầu từ 0. Hai đại lượng khác đơn vị → hai biểu đồ.
- ≥2 chuỗi có legend; 1 chuỗi không cần legend (tiêu đề nói tên).
- Hover hiện tooltip giá trị; nút **Xem bảng** luôn có (bắt buộc vì `chart-4` Light chỉ 2,1:1 trên nền).
- Chữ, nhãn, giá trị dùng `foreground`/`muted-foreground`, không dùng màu chuỗi.
- Tối đa 5 chuỗi; nhiều hơn gộp vào “Khác” hoặc tách biểu đồ nhỏ.
- Bảng màu đã kiểm tra mù màu (CVD ΔE ≥ 8) ở cả Light và Dark.

### Checkbox

Ô chọn bật/tắt độc lập. Hộp 16px với vùng chạm mở rộng 44px.

**Consumer cung cấp:** `label`, `description`, `checked`/`defaultChecked`, `onCheckedChange`, `disabled`, `id`.

- Dùng cho đồng ý điều khoản trên landing, chọn nhiều file trong Drive.
- Thay đổi có hiệu lực ngay → dùng `Switch`.

### Collapsible

Một khối thu gọn/mở rộng đơn lẻ — ghi chú cũ, bộ lọc nâng cao.

**Consumer cung cấp:** `trigger` (tiêu đề), `children`, `open`/`defaultOpen`, `onOpenChange`.

- Nhiều mục cùng cấp dùng `Accordion`.

### Combobox

Chọn một giá trị từ danh sách dài có ô tìm kiếm — nhân viên phụ trách, dự án, quận.

**Consumer cung cấp:** `options` `[{value, label, keywords?}]`, `value`/`defaultValue`, `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyText`, `clearable`.

- Tìm không phân biệt dấu: gõ *quan* khớp *Quân*.

### Command

Bảng lệnh có tìm kiếm: tìm nhanh lead, file, dự án và chạy tác vụ (⌘K).

**Consumer cung cấp:** `groups` `[{heading, items: [{value, label, icon?, shortcut?, keywords?, disabled?}]}]`, `onSelect(value, item)`, `placeholder`, `emptyText`, `maxHeight`.

- Đặt trong `Dialog` để có Command Palette; ↑/↓ di chuyển, Enter chọn.
- Tìm không phân biệt dấu.

### ContextMenu

Menu chuột phải (hoặc nhấn giữ 500ms trên cảm ứng) cho file trong Drive và hàng trong bảng.

**Consumer cung cấp:** `children` (vùng kích hoạt), `items` theo cấu trúc `DropdownMenu`.

- Mọi tác vụ trong ContextMenu phải có đường khác (nút `ellipsis`) — người dùng không tự biết chuột phải.

### DataTable

Bảng dữ liệu đầy đủ cho CRM desktop: tìm kiếm, sắp xếp cột, chọn hàng, phân trang.

**Consumer cung cấp:** `columns` `[{key, header, sortable?, align?, numeric?, format?, render?}]`, `data`, `rowKey`, `searchKeys`, `searchPlaceholder`, `selectable`, `pageSize`, `defaultSort` `{key, dir}`, `emptyText`.

- Cột số `numeric` + `align: 'right'`. Trạng thái render bằng `Badge`.
- Mobile hiển thị cùng dữ liệu bằng `Card`.

### DatePicker

Chọn ngày bằng `Popover` + `Calendar`; hiển thị `dd/mm/yyyy`.

**Consumer cung cấp:** `value`/`defaultValue`, `onValueChange`, `placeholder`, `disablePast`, `label`, `id` (nối với `Label`).

- Trên mobile có thể thay bằng `<input type="date">` gốc nếu cần bộ chọn hệ thống.

### Dialog

Hộp thoại modal cho xác nhận và form ngắn; bắt buộc cho thao tác xóa.

**Consumer cung cấp:** `open`, `onOpenChange`, `title`, `description`, `children`, `footer` (các Button), `role` (`alertdialog` cho xác nhận xóa).

- Nút đóng `x` 44px góc phải, Esc và click nền đều đóng — nhất quán trên mọi overlay.
- Footer: hành động chính bên phải trên desktop, trên cùng khi xếp dọc mobile.
- Xác nhận xóa: tiêu đề nêu đối tượng, mô tả nêu hệ quả, nút `destructive` ghi rõ hành động.

### Drawer

Ngăn kéo từ đáy cho mobile (tương đương shadcn `Drawer`/vaul) — bộ lọc, tác vụ nhanh.

**Consumer cung cấp:** như `Sheet` (`open`, `onOpenChange`, `title`, `description`, `children`, `footer`); cạnh luôn là đáy.

### DropdownMenu

Menu tác vụ phụ mở từ nút `ellipsis` hoặc trigger tùy chỉnh.

**Consumer cung cấp:** `items` `[{label, icon?, onSelect, destructive?, disabled?, shortcut?}]` hoặc `{separator: true}`, `trigger` (mặc định nút ghost icon 44px), `align` (`start` | `end`), `heading`.

- Đặt tác vụ phá hủy ở cuối, sau separator, với `destructive: true`.
- Esc và click ra ngoài để đóng; ↑/↓ để di chuyển.

### Empty

Trạng thái rỗng: icon, tiêu đề, mô tả ngắn, một hành động.

**Consumer cung cấp:** `icon`, `title`, `description`, `action`.

- Nói điều người dùng làm được tiếp theo: *Tải tài liệu đầu tiên*, không chỉ *Không có dữ liệu*.

### FormField

Khung trường form: Label + control + mô tả hoặc lỗi.

**Consumer cung cấp:** `label`, `htmlFor` (trùng `id` của control), `children` (Input/Select/Textarea), `description`, `error`, `required`.

- `error` thay chỗ `description`, có icon `circle-alert` và `role="alert"` — trạng thái dùng cả chữ và màu.
- Gắn `aria-describedby="<id>-error"` hoặc `"<id>-desc"` trên control.
- Lỗi viết theo hướng sửa: *Nhập số điện thoại 10 chữ số*, không viết *Sai định dạng*.

### HoverCard

Thẻ xem nhanh khi hover/focus vào tên khách, nhân viên hoặc dự án trên desktop (trễ 300ms).

**Consumer cung cấp:** `children` (element focus được, thường link), `content`.

- Không đặt hành động bắt buộc trong HoverCard; mobile không có hover.

### Icon

Icon Lucide (stroke 2, 24×24, `currentColor`) đóng gói sẵn trong bundle.

**Consumer cung cấp:** `name`, `size` (mặc định 16), `label` khi icon mang nghĩa độc lập (không kèm chữ).

Tên có sẵn: `house` `sparkles` `users` `folder` `search` `upload` `phone` `calendar` `chevron-down` `chevron-right` `check` `x` `ellipsis` `file-text` `circle-alert` `info` `plus` `send` `file-image` `file-spreadsheet` `map-pin` `user-check` `clock` `settings` `log-out` `bell`. Cần icon khác: dùng `lucide-react` trong codebase.

### Input

Ô nhập một dòng: 36px, viền `input`, chữ 16px trên mobile (14px từ 768px) để iOS không tự zoom.

**Consumer cung cấp:** mọi thuộc tính `<input>` (`type`, `value`, `onChange`, `placeholder`, `inputMode`), `invalid` khi lỗi.

- Số điện thoại: `inputMode="tel"`, `className="pt-num"`.
- `invalid` đổi viền sang `destructive`; luôn kèm thông điệp qua `FormField error`.
- Ô tìm kiếm Drive: đặt `Icon search` trong Button cạnh ô hoặc dùng `type="search"`.

### InputGroup

Ô nhập kèm icon, tiền tố/hậu tố hoặc nút bên trong một viền.

**Consumer cung cấp:** thuộc tính `<input>` cùng `icon`, `prefix`, `suffix` (ví dụ `đ`, `m²`), `action` (một `Button` `size="sm"`), `invalid`.

- Tìm kiếm: `icon="search"`. Ngân sách: `suffix="tỷ"`, `inputMode="decimal"`.

### InputOTP

Nhập mã xác thực một lần (OTP) từng ô, hỗ trợ dán cả mã và tự điền từ SMS.

**Consumer cung cấp:** `length` (mặc định 6), `groups` (ví dụ `[3, 3]`), `value`/`defaultValue`, `onChange`, `onComplete(code)`, `invalid`.

### Kbd

Hiển thị phím tắt bàn phím.

**Consumer cung cấp:** `children` (một phím). Ghép nhiều `Kbd` cho tổ hợp.

### Label

Nhãn cho trường nhập, đặt phía trên ô nhập.

**Consumer cung cấp:** `htmlFor` trỏ tới `id` của trường, `children`.

- Luôn có Label hiển thị, không dùng placeholder thay nhãn (viền `input` mờ, Label là mốc chính).
- Dùng `FormField` để ghép Label + mô tả + lỗi.

### Menubar

Thanh menu kiểu ứng dụng desktop (Drive, CRM trên màn hình rộng).

**Consumer cung cấp:** `menus` `[{label, items}]` — `items` theo cấu trúc của `DropdownMenu`.

- Chỉ dùng trên desktop; mobile dùng `DropdownMenu` hoặc `Sheet`.

### NavigationMenu

Điều hướng đầu trang cho landing page: liên kết thẳng và mục mở bảng liên kết.

**Consumer cung cấp:** `items` `[{label, href?, active?}]` hoặc `[{label, links: [{title, description, href}]}]`, `label`.

- Desktop mở khi hover hoặc click; mobile thay bằng `Sheet` bên phải với cùng mục.

### Pagination

Phân trang cho bảng CRM desktop.

**Consumer cung cấp:** `page`, `total`, `onPageChange`.

- Mobile dùng cuộn vô hạn hoặc nút *Xem thêm*.

### Popover

Khung nổi chứa nội dung tương tác nhỏ (bộ lọc nhanh, xem trích dẫn AI).

**Consumer cung cấp:** `trigger` (một element, thường Button), `children`, `open`/`onOpenChange`, `align`.

### Progress

Thanh tiến độ cho upload Drive và xử lý tài liệu.

**Consumer cung cấp:** `value` (0–100), `label` (tên file hoặc tác vụ).

- Luôn hiển thị tên file, loại file và phần trăm bằng chữ bên cạnh.

### RadioGroup

Chọn một trong vài lựa chọn hiển thị cùng lúc.

**Consumer cung cấp:** `options` `[{value, label, description?, disabled?}]`, `value`/`defaultValue`, `onValueChange`, `orientation`, `label`.

- 2–5 lựa chọn; nhiều hơn dùng `Select`.

### Resizable

Hai khung kéo đổi kích thước — danh sách lead bên trái, chi tiết bên phải trên desktop.

**Consumer cung cấp:** hai `children`, `defaultSize` (% khung trái), `minSize` (%), `label`, `style` (chiều cao).

- Kéo tay nắm hoặc focus rồi dùng ←/→ (bước 5%).

### ScrollArea

Vùng cuộn có thanh cuộn mảnh theo token `border`, dùng cho danh sách dài trong khung cố định.

**Consumer cung cấp:** `children`, `maxHeight`, `orientation` (`vertical` | `horizontal`), `label` (vùng cuộn focus được bằng bàn phím).

### Select

Chọn một giá trị từ danh sách — chọn dự án cho Trợ lý AI, nguồn lead, nhân viên phụ trách.

**Consumer cung cấp:** `options` `[{value, label, disabled?}]`, `placeholder`, `value`/`defaultValue`, `onValueChange`, `invalid`.

- Dựng trên `<select>` gốc để dùng bộ chọn hệ thống trên mobile; giao diện khớp `SelectTrigger` của shadcn (36px, chevron 50%).
- Trên desktop có thể thay bằng shadcn `Select` (Radix) với cùng token.

### Separator

Đường phân cách 1px bằng `border`.

**Consumer cung cấp:** `orientation` (`horizontal` | `vertical`), `decorative` (mặc định trang trí).

### Sheet

Bảng trượt từ cạnh màn hình. Mobile dùng cạnh đáy cho chi tiết file Drive và tác vụ CRM; desktop dùng cạnh phải.

**Consumer cung cấp:** `open`, `onOpenChange`, `side` (`bottom` | `right` | `left` | `top`), `title`, `description`, `children`, `footer`.

- Sheet đáy có tay kéo, radius `radius-xl` phía trên, chừa `safe-area-inset-bottom`.
- Footer xếp dọc, CTA chính đầy chiều rộng.

### SidebarNav

Sidebar điều hướng desktop, cùng mục với `BottomNav`.

**Consumer cung cấp:** `items`, `value`/`defaultValue`, `onValueChange`, `header` (thường `BrandMark`), `footer` (tài khoản).

- Rộng 256px, nền `sidebar`, mục đang chọn `sidebar-accent`.

### Skeleton

Khối giữ chỗ khi tải, màu `accent`, nhịp pulse (tắt khi `prefers-reduced-motion`).

**Consumer cung cấp:** `className`/`style` với kích thước khớp nội dung thật.

### Slider

Chọn giá trị trong khoảng — ngân sách, diện tích, tầng.

**Consumer cung cấp:** `label`, `min`, `max`, `step`, `value`/`defaultValue`, `onValueChange`, `format(v)` để hiển thị.

- Dựng trên `<input type="range">` gốc (bàn phím, trình đọc màn hình có sẵn); luôn hiện giá trị bằng chữ.

### Spinner

Chỉ báo đang xử lý cho thao tác ngắn (gửi câu hỏi AI, lưu, tải trang con).

**Consumer cung cấp:** `size` (px), `label` cho trình đọc màn hình.

- Thao tác có tiến độ đo được dùng `Progress`; tải nội dung dùng `Skeleton`.

### Switch

Công tắc cho thiết lập có hiệu lực ngay.

**Consumer cung cấp:** `label`, `description`, `checked`/`defaultChecked`, `onCheckedChange`.

- Label bên trái, công tắc bên phải, cả hàng là vùng chạm.

### Table

Bảng dữ liệu cho desktop khi cần đối chiếu nhiều hồ sơ; mobile dùng `Card`.

**Consumer cung cấp:** `Table` › `TableHeader`/`TableBody`/`TableFooter` › `TableRow` › `TableHead`/`TableCell`, `TableCaption`.

- Cột số và ngày dùng `pt-num` (`tabular-nums`) và căn phải.
- Trạng thái trong ô dùng `Badge` có chữ.
- Bọc trong vùng cuộn ngang; không thu nhỏ chữ dưới 14px.

### Tabs

Chuyển giữa các khung nội dung cùng cấp. Tab đang chọn dùng `accent` / `accent-foreground` theo nguồn.

**Consumer cung cấp:** `Tabs` (`value`/`defaultValue`, `onValueChange`) › `TabsList` (`label`, `full`) › `TabsTrigger` (`value`) + `TabsContent` (`value`).

- `full` chia đều chiều ngang trên mobile.
- ←/→ chuyển tab.

### Textarea

Ô nhập nhiều dòng cho ghi chú lead và câu hỏi gửi Trợ lý AI.

**Consumer cung cấp:** thuộc tính `<textarea>` (`rows`, `value`, `onChange`, `placeholder`), `invalid`.

- Cao tối thiểu 64px, kéo giãn theo chiều dọc.

### Toaster

Thông báo ngắn tự ẩn (kiểu Sonner). Đặt `<Toaster />` một lần ở gốc ứng dụng, gọi `toast()` từ bất kỳ đâu.

**Consumer cung cấp:** `Toaster` (`position` `bottom`|`top`, `inline`); `toast({title, description, variant: 'success'|'error'|'info', action: {label, onClick}, duration})`, `toast.success(t)`, `toast.error(t)`.

- Dùng cho xác nhận thao tác đã xong: *Đã đặt lịch xem 09:00 thứ Bảy*.
- Lỗi cần người dùng xử lý dùng `Alert` hoặc lỗi form, không chỉ toast.
- Mobile: đặt trên thanh điều hướng đáy.

### Toggle

Nút bật/tắt đơn lẻ (shadcn `Toggle`) — ghim lead, lọc nhanh, bật định dạng.

**Consumer cung cấp:** `pressed`/`defaultPressed`, `onPressedChange`, `icon`, `children`, `variant` (`default` | `outline`), `aria-label` khi chỉ có icon.

### ToggleGroup

Nhóm nút bật/tắt để lọc nhanh hoặc chọn chế độ xem.

**Consumer cung cấp:** `items` `[{value, label, icon?}]`, `type` (`single` | `multiple`), `value`/`defaultValue`, `onValueChange`, `label` cho trình đọc màn hình.

- Dùng cho bộ lọc ngắn (Hôm nay · Tuần này · Tháng này) hoặc chuyển Thẻ/Bảng trong CRM.
- Từ 5 lựa chọn trở lên, dùng `Select`.

### Tooltip

Gợi ý ngắn khi hover/focus cho nút icon trên desktop. Nền `foreground`, chữ `background`.

**Consumer cung cấp:** `content`, `children` (một element focus được), `side` (`top` | `bottom`).

- Không thay thế `aria-label`; mobile không có hover nên thông tin quan trọng phải hiện sẵn.
