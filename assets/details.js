/* Mô tả ngắn + con số cho từng sản phẩm, hiện ở đầu trang xem trước dự án.
   Chỉ dùng số đã xác nhận (đo thật hoặc ước lượng đã được chủ CV xác nhận). Sản phẩm chưa có số: chỉ có mô tả và phạm vi. */
window.PRODUCT_DETAILS = {
  'pc-race': {
    vi: { d: 'Nền tảng số toàn trình cho giải chạy: người chạy tìm ảnh bằng số BIB (không quét khuôn mặt), lưu ảnh và kết quả vào hồ sơ NetRace ID, mua vé online; ban tổ chức quản lý giải trên NetRace OS.',
          s: [['3', 'giải đã vận hành'], ['30.000+', 'ảnh đã xử lý'], ['10.000+', 'người chạy'], ['95,6%', 'ảnh gắn đúng người · Amber Run'], ['24 giờ', 'người chạy nhận ảnh']],
          r: 'PM sở hữu sản phẩm: định hình luồng, ưu tiên tính năng, chốt yêu cầu bằng prototype (Vibe Design), chủ trì UAT.' },
    en: { d: 'An end-to-end platform for running races: runners find photos by BIB number (no face scanning), keep photos and results in a NetRace ID profile and buy tickets online; organisers run races on NetRace OS.',
          s: [['3', 'races run'], ['30,000+', 'photos processed'], ['10,000+', 'runners'], ['95.6%', 'photos matched · Amber Run'], ['24 hours', 'photo delivery']],
          r: 'PM and product owner: shaped the flows, prioritised features, locked requirements with working prototypes (Vibe Design), owned UAT.' }
  },
  'pc-kol': {
    vi: { d: 'Cổng thông tin và cơ sở dữ liệu KOL, MCN, Influencer: bảng xếp hạng theo tuần, tháng, chỉ số ảnh hưởng xã hội, luồng xác thực KOL/MCN và tiếp nhận phản ánh vi phạm; nối KolSafety để quét nội dung.',
          s: [['15.000+', 'user sau khi ra mắt'], ['3', 'nền tảng quét: TikTok, YouTube, Facebook']],
          r: 'PM: định nghĩa bảng xếp hạng và chỉ số, thiết kế luồng xác thực và xử lý phản ánh.' },
    en: { d: 'An information portal and database of KOLs, MCNs and influencers: weekly and monthly rankings, a social influence score, KOL/MCN verification and violation reporting, connected to KolSafety for content scanning.',
          s: [['15,000+', 'users after launch'], ['3', 'platforms scanned: TikTok, YouTube, Facebook']],
          r: 'PM: defined rankings and metrics, designed the verification and report-handling flows.' }
  },
  'pc-cms': {
    vi: { d: 'CMS cho toà soạn và doanh nghiệp: dàn trang, quản lý bài theo trạng thái, duyệt bài phóng viên → biên tập → thư ký toà soạn; NetSocial và NetStory dùng AI để biến một bài báo thành video, bài đăng mạng xã hội, podcast và E-magazine.',
          s: [['5', 'trạng thái bài: nháp → xuất bản → gỡ'], ['3', 'cấp duyệt bài'], ['7', 'nền tảng đăng bài từ NetSocial']],
          r: 'PM: chuẩn hoá quy trình duyệt bài, định hướng mảng tạo nội dung bằng AI.' },
    en: { d: 'A CMS for newsrooms and businesses: page layout, status-based post management and reporter → editor → managing editor approval; NetSocial and NetStory use AI to turn one article into video, social posts, podcasts and e-magazines.',
          s: [['5', 'post states: draft → published → unpublished'], ['3', 'approval levels'], ['7', 'platforms NetSocial publishes to']],
          r: 'PM: standardised the approval workflow and led the AI content area.' }
  },
  'NS-01': {
    vi: { d: 'Công cụ tạo e-magazine bằng AI, mở ngay từ NetCMS: chọn tin nguồn trong Tư liệu, chọn mẫu dàn trang, trợ lý AI dựng bài, gợi ý hiệu ứng và soát chính tả, rồi xuất bản.',
          s: [['< 5 phút', 'tạo xong một e-magazine'], ['Prompt', 'chỉnh sửa từng Section và Component trong e-magazine'], ['5', 'bước: Ý tưởng → Nội dung → Hình ảnh → Bố cục → Xuất bản']],
          r: 'PM: định hình luồng tạo e-magazine bằng AI, thiết kế bằng Vibe Design.' },
    en: { d: 'An AI e-magazine builder launched from NetCMS: pick a source story, choose a layout template, let the AI assistant build the piece, suggest effects and check spelling, then publish.',
          s: [['< 5 min', 'to build a complete e-magazine'], ['Prompt', 'edits for every section and component of the e-magazine'], ['5', 'steps: Idea → Content → Images → Layout → Publish']],
          r: 'PM: shaped the AI e-magazine flow, designed with Vibe Design.' }
  },
  'NS-02': {
    vi: { d: 'Tổ chức sự kiện số từ đầu đến cuối: tạo sự kiện và trang đăng ký công khai, hạng vé miễn phí hoặc có phí, mời khách qua email, quản lý người tham dự và check-in bằng QR hoặc số điện thoại.',
          s: [['2', 'cách check-in: QR, số điện thoại']],
          r: 'PM: định hình luồng ban tổ chức, thiết kế bằng Vibe Design.' },
    en: { d: 'End-to-end digital events: create an event and a public sign-up page, free or paid ticket tiers, email invitations, attendee management and check-in by QR code or phone number.',
          s: [['2', 'check-in methods: QR, phone']],
          r: 'PM: shaped the organiser flow, designed with Vibe Design.' }
  },
  'NS-03': {
    vi: { d: 'Mạng xã hội nội dung chiều sâu của Báo Góc Nhìn Mới: Spotlight, Nghe & Xem, eMagazine; nội dung được xuất bản từ NetCMS.', s: [], r: '' },
    en: { d: 'An in-depth content social network for Goc Nhin Moi: Spotlight, Listen & Watch and eMagazine, published from NetCMS.', s: [], r: '' }
  },
  'NS-05': {
    vi: { d: 'Toà soạn hội tụ bằng AI: dán link bài báo, AI viết lời, đọc giọng, chọn hình để dựng video; tạo bài đăng mạng xã hội, podcast, bản đọc và tạp chí lật trang từ 1–10 bài.',
          s: [['7', 'nền tảng: Facebook, Instagram, TikTok, Threads, X, LinkedIn, Zalo'], ['1–10', 'bài gom thành một tạp chí']],
          r: 'PM: định hướng sản phẩm, thiết kế bằng Vibe Design.' },
    en: { d: 'An AI-powered converged newsroom: paste an article link and AI writes the script, voices it and picks visuals to build a video; also creates social posts, podcasts, audio reads and flip-book magazines from 1–10 articles.',
          s: [['7', 'platforms: Facebook, Instagram, TikTok, Threads, X, LinkedIn, Zalo'], ['1–10', 'articles per magazine']],
          r: 'PM: set product direction, designed with Vibe Design.' }
  },
  'NS-06': {
    vi: { d: 'Trust & Safety cho KOL/MCN và nhãn hàng: quét video, kênh TikTok, YouTube, Facebook theo bộ quy tắc, chấm Điểm An toàn 0–100, chỉ rõ lỗi và mốc thời gian; đối chiếu video KOL với bộ rule quảng cáo của từng chiến dịch.',
          s: [['0–100', 'Điểm An toàn mỗi video'], ['3', 'nền tảng quét'], ['6', 'rule mỗi chiến dịch nhãn hàng'], ['3', 'mức kết luận: Đạt, Không đạt, Cần người xem']],
          r: 'PM: xây quy trình quét → cảnh báo → xử lý, bộ quy tắc và ngưỡng vi phạm, admin portal.' },
    en: { d: 'Trust & Safety for KOL/MCNs and brands: scans videos and channels on TikTok, YouTube and Facebook against rule sets, gives a 0–100 Safety Score with the issue and timestamps, and checks KOL videos against each campaign\'s ad rules.',
          s: [['0–100', 'Safety Score per video'], ['3', 'platforms scanned'], ['6', 'rules per brand campaign'], ['3', 'verdicts: Pass, Fail, Needs review']],
          r: 'PM: built the scan → alert → action flow, rule sets and thresholds, and the admin portal.' }
  },
  'NS-07': {
    vi: { d: 'Sàn giao dịch bất động sản trực tuyến: chuyên viên nguồn hàng nhận ký gửi, khảo sát và đăng tin; chuyên viên dẫn khách xếp lịch xem nhà, báo cáo và lập phiếu YCCCDV; Admin tổng duyệt tin, theo dõi giao dịch, dòng tiền và chi trả hoa hồng toàn sàn.',
          s: [['5', 'phase giao dịch toàn trình, từ đăng tin đến bàn giao'], ['4', 'cổng liên thông: VNeID, đất đai, thuế, ngân hàng'], ['3', 'vai trò: Admin tổng, nguồn hàng, dẫn khách'], ['30/11/2026', 'mốc chốt demo trình cơ quan nhà nước']],
          r: 'Bản demo xin đề án. PM: định hình luồng giao dịch và phân quyền theo vai trò, dựng prototype bằng Vibe Design.' },
    en: { d: 'An online real estate marketplace: listing agents take consignments, survey and publish listings; showing agents schedule viewings, file reports and service requests; the central admin approves listings and tracks deals, cash flow and commission payouts across the platform.',
          s: [['5', 'end-to-end deal phases, from listing to handover'], ['4', 'national gateways: VNeID, land registry, tax, banking'], ['3', 'roles: central admin, listing agent, showing agent'], ['30/11/2026', 'demo deadline for the government proposal']],
          r: 'Proposal demo. PM: shaped the deal flow and role-based access, built the prototype with Vibe Design.' }
  },
  'NS-08': {
    vi: { d: 'Cổng thông tin bất động sản cho mạng lưới môi giới Thiên Khôi, nối với sàn giao dịch Thiên Việt.',
          s: [['3.000+', 'tài khoản mới trong 30 ngày']], r: '' },
    en: { d: 'A real estate portal for the Thien Khoi broker network, connected to the Thien Viet marketplace.',
          s: [['3,000+', 'new accounts in 30 days']], r: '' }
  },
  'CS-01': {
    vi: { d: 'Page Builder KiotViet: công cụ no-code để chủ shop tự dựng website bán hàng.', s: [['10.000+', 'user'], ['3 tháng', 'đạt KPI sau release']], r: 'Product Design Lead kiêm PO.' },
    en: { d: 'KiotViet Page Builder: a no-code tool for shop owners to build their own store website.', s: [['10,000+', 'users'], ['3 months', 'to hit KPI after release']], r: 'Product Design Lead and PO.' }
  },
  'CS-03': {
    vi: { d: 'App đọc truyện Weeboo với luồng mua IAP Apple/Google, xu và gói VIP.', s: [['200.000+', 'user'], ['3 tháng', 'từ thiết kế đến ra mắt']], r: 'Product Designer.' },
    en: { d: 'Weeboo story-reading app with Apple/Google IAP, coins and VIP plans.', s: [['200,000+', 'users'], ['3 months', 'from design to launch']], r: 'Product Designer.' }
  }
};
