# KỊCH BẢN SÁT — IMPLEMENTATION PLAN V15 FINAL

**Document type:** Implementation & Execution Plan  
**Version:** V15 Final  
**Baseline:** `PRODUCT_SPEC_V15_Final.md`  
**Previous version:** `IMPLEMENTATION_PLAN_V14(1).md` (uploaded source; nội dung kế thừa từ Implementation Plan V14)  
**Status:** Execution Plan — Phase 3 & Phase 4 business design Accepted; Phase 5 Database Design, Phase 6 API Contract & Background Jobs, Phase 7 Implementation & Testing chưa được nghiệm thu hoàn tất.  
**Target:** MVP trong 4 tuần, nhóm 6 thành viên.  
**Development environment:** Windows Native, VS Code, không sử dụng Docker trong phạm vi hiện tại.

> **Quy tắc versioning:** Đây là file mới, không ghi đè Implementation Plan V14. Product Spec V15 Final là baseline yêu cầu. Kế hoạch này mô tả cách thực hiện; không tự tạo hoặc thay đổi business rule.

---

## Change Log — V15 Final

| Hạng mục | Cập nhật |
|---|---|
| Baseline | Chuyển từ Product Spec V14 sang `PRODUCT_SPEC_V15_Final.md`. |
| Accepted design | Ghi nhận Phase 3 (GameRoom/RoomParticipant) và Phase 4 (DMAssignment, ScheduleProposal, Session, PlayerPayment, Refund) đã Accepted ở mức thiết kế nghiệp vụ. |
| Design gates | Bỏ trạng thái D4 còn pending của V14; thay bằng Phase 5 Database Design và Phase 6 API Contract & Background Jobs theo roadmap V15. |
| Repository governance | Chỉ `nguyenxuanhieu2903/kich-ban-sat` là repository phát triển chính thức; `Danh-K/FE_Kich_Ban_Sat` chỉ dùng audit/tham khảo. |
| Frontend | Nhóm tự thiết kế và xây dựng lại Frontend: UI/UX, routing, layout, components, state management, API client và source architecture. Không mặc định kế thừa source/UI từ repo tham khảo. |
| Database | Tự thiết kế ERD, relational schema, keys, relationships, constraints, indexes, transaction boundaries và Flyway migrations trong Phase 5. |
| API | Tự thiết kế API Contract/OpenAPI, DTO, validation, error contract, authorization matrix và idempotency trong Phase 6. |
| Team | Điều chỉnh ownership thành 2 Backend, 3 Frontend, 1 Documentation/Report/Slides. |
| Timeline | Chuẩn hóa kế hoạch 4 tuần theo milestone M1–M4; Phase 5 và Phase 6 là design gates, Phase 7 là implementation/testing. |
| Source protection | Bổ sung quy trình audit, backup/checkpoint, branch protection và cấm thao tác phá hủy khi chưa có xác nhận. |
| Testing | Đồng bộ test matrix theo toàn bộ quyết định Phase 3/4 Accepted, race conditions, idempotency, security và E2E. |

---

## 0. Mục tiêu và nguyên tắc điều hành

### 0.1. Mục tiêu

Triển khai MVP Kịch Bản Sát trong 4 tuần theo `PRODUCT_SPEC_V15_Final.md`, tạo ra sản phẩm có thể chạy local, tích hợp Frontend–Backend–Database và trình diễn được luồng nghiệp vụ cốt lõi end-to-end.

Implementation Plan phải giúp nhóm:
- Biết chính xác làm gì, ai chịu trách nhiệm, đầu ra nào cần bàn giao.
- Không nhầm thiết kế nghiệp vụ đã Accepted với thiết kế kỹ thuật chưa hoàn tất.
- Tự thiết kế lại ERD/Database và API Contract thay vì sao chép thiết kế cũ.
- Xây dựng lại Frontend có kiến trúc thống nhất.
- Phát triển Backend và Frontend song song theo feature/vertical slice sau khi contract liên quan được thống nhất.
- Bảo vệ source code hiện có, tránh mất dữ liệu hoặc ghi đè nhầm.
- Có test evidence và acceptance criteria cho từng milestone.

### 0.2. Mô hình triển khai

Áp dụng **Design Gates + Incremental Vertical Slices**:

```text
PRODUCT_SPEC_V15_Final.md
        |
        v
Phase 5 — Database Design
(ERD / schema / constraints / indexes / migrations)
        |
        v
Phase 6 — API Contract & Background Jobs
(OpenAPI / DTO / errors / authorization / idempotency / jobs)
        |
        v
Phase 7 — Implementation & Testing
        |
        +------------------------------+
        |                              |
        v                              v
Backend implementation          Frontend rebuild
        |                              |
        +---------------+--------------+
                        |
                        v
             Integration + E2E tests
                        |
                        v
             Runtime evidence + review
                        |
                        v
                 Git checkpoint
```

Trong khi thiết kế Phase 5/6, Frontend có thể làm các công việc không phụ thuộc contract như audit yêu cầu UI, information architecture, design system, wireframe, layout shell và component visual. Không tự tạo API shape hoặc business state để giả lập contract chưa được duyệt.

### 0.3. Phạm vi sản phẩm phải tuân thủ

- Public Home Page là điểm vào mặc định; Guest có thể khám phá Game và GameRoom được phép công khai.
- Đăng nhập bắt buộc trước khi tạo/tham gia GameRoom hoặc truy cập dữ liệu cá nhân.
- Các vai trò chính: `PLAYER`, `DM`, `ADMIN`; Backend thực thi RBAC và resource authorization.
- Booking dựa trên GameRoom linh hoạt, không phải danh sách suất cố định.
- Phân biệt `GameRoom` (nhóm người chơi) với `PhysicalRoom` (phòng thực tế tại quán).
- Backend: Java 21, Spring Boot 3.x, Maven, Spring Data JPA/Hibernate, Spring Security.
- Database: PostgreSQL, versioning bằng Flyway.
- Frontend: Next.js + React + TypeScript; nhóm tự thiết kế lại toàn bộ Frontend.
- API: REST/JSON; API Contract là thiết kế mới của nhóm.
- Kiến trúc: Feature-oriented + Layered Architecture; một backend Spring Boot và một PostgreSQL dùng chung.
- Notification Center lưu DB; MVP dùng polling, không triển khai WebSocket.
- Payment là mock/internal workflow; không tích hợp cổng thanh toán tiền thật.
- Môi trường native Windows, VS Code; không Docker/Docker Compose/container trong phạm vi hiện tại.
- Deployment/hosting/CI-CD chỉ thiết kế sau khi MVP ổn định và có quyết định riêng.

### 0.4. Repository và source ownership

**Repository phát triển chính thức:** `nguyenxuanhieu2903/kich-ban-sat`.

**Repository tham khảo:** `Danh-K/FE_Kich_Ban_Sat`.

Quy tắc:
1. Chỉ repository chính thức là nơi phát triển, commit, review, tích hợp và duy trì sản phẩm.
2. Repository tham khảo chỉ được audit/đọc để tìm hiểu luồng nghiệp vụ, edge cases hoặc ý tưởng UX.
3. Không lấy repository tham khảo làm base code để tiếp tục phát triển.
4. Không copy nguyên source, UI, component, routing, state management, ERD, schema, migration, endpoint hoặc DTO từ repository tham khảo.
5. Nhóm tự xây dựng lại Frontend và tự thiết kế ERD/Database/API Contract.
6. Product Spec V15 Final quyết định hành vi sản phẩm; repo tham khảo không được dùng để ghi đè yêu cầu.
7. Mọi thay đổi code phải nằm trong repository chính thức và qua Git workflow của nhóm.

### 0.5. Quy tắc không được vi phạm

1. Không tự sửa business rule đã Accepted trong Phase 3/4.
2. Không biến đề xuất kỹ thuật thành quyết định đã xác nhận.
3. Không code phụ thuộc schema khi Phase 5 chưa được nghiệm thu.
4. Không cho FE/BE tự suy diễn API contract khi Phase 6 chưa được nghiệm thu.
5. Backend là nguồn sự thật về quyền, trạng thái, điều kiện game, deadline, lịch và tiền.
6. Không tin giá, role, amount, status, participant identity hoặc kết quả payment do Frontend gửi lên.
7. Schema change phải qua Flyway migration mới; không sửa migration đã chạy trên môi trường dùng chung.
8. Không commit secret; không đưa `.env` vào Git; không trả stack trace hoặc dữ liệu nhạy cảm ra client.
9. Không đánh dấu PASS nếu chưa chạy lệnh tương ứng và có kết quả.
10. Không tự động push, merge, reset hard, force push hoặc viết lại Git history.
11. Trước thao tác có rủi ro phải kiểm tra branch, `git status`, diff và backup/checkpoint.
12. Không xóa file hoặc dữ liệu chưa hiểu rõ.
13. Mỗi sub-phase có deliverable, acceptance criteria, test evidence và báo cáo ngắn.
14. Nếu phát hiện mâu thuẫn với Product Spec, dừng phần bị ảnh hưởng và yêu cầu xác nhận.

---

## 1. Phân biệt trạng thái thiết kế và trạng thái triển khai

### 1.1. Trạng thái đã Accepted

| Phase | Phạm vi | Trạng thái chính xác |
|---|---|---|
| Phase 1 | Product Specification Baseline | Completed theo version history của Product Spec |
| Phase 2 | Architecture & Domain Design | Đã xác nhận định hướng kiến trúc |
| Phase 3 | GameRoom & RoomParticipant State Machine | **Accepted ở mức thiết kế nghiệp vụ** |
| Phase 4 | DMAssignment, ScheduleProposal, Session, PlayerPayment, Refund | **Accepted ở mức thiết kế nghiệp vụ** |
| Phase 5 | Database Design | Chưa hoàn tất — ERD/schema/constraints/indexes/migrations |
| Phase 6 | API Contract & Background Jobs | Chưa hoàn tất — OpenAPI/API contract/jobs/idempotency |
| Phase 7 | Implementation & Testing | Chưa hoàn tất — code, integration, tests, runtime evidence |

**Lưu ý:** Phase 3/4 Accepted không có nghĩa ERD, API, migration, source code hoặc test đã hoàn thành.

### 1.2. Design gates bắt buộc

| Gate | Đầu vào | Đầu ra cần nghiệm thu | Không được làm trước khi đạt gate |
|---|---|---|---|
| G0 — Repository & Environment Audit | Repo chính thức, repo tham khảo, máy local | Audit report, source baseline, backup/checkpoint, lệnh chạy thực tế | Không rewrite hoặc xóa source chưa audit |
| G1 — Phase 5 Database Design | Product Spec V15 Final, Phase 3/4 Accepted | ERD, data dictionary, schema, constraints, indexes, transaction/locking design, migration plan | Không tạo migration nghiệp vụ chính thức hoặc code persistence phụ thuộc schema chưa duyệt |
| G2 — Phase 6 API & Jobs | Product Spec + Database Design được duyệt | OpenAPI/API Contract, DTO, error model, auth matrix, idempotency, job catalog/schedule/retry | Không cho FE/BE tự đặt endpoint, payload, response hoặc deadline job contract |
| G3 — Phase 7 Implementation | G1 + G2 đã duyệt | Source code, tests, integrated vertical slices, runtime evidence | Không đánh dấu tính năng Done chỉ vì code đã được tạo |
| G4 — MVP Release Readiness | MVP implementation | Regression, security, clean setup, demo, docs, handover | Không công bố MVP đạt nếu còn blocker nghiêm trọng chưa được chấp nhận |

### 1.3. Quy tắc nghiệm thu phase

- Mỗi phase có tài liệu đầu ra và checklist acceptance riêng.
- Sau khi hoàn thành, nhóm review nội dung và người dùng xác nhận trước khi chuyển phase tiếp theo.
- Phase 5/6 có thể chuẩn bị workspace và phân tích song song, nhưng không được coi là hoàn tất khi thiếu deliverable bắt buộc.
- Phase 7 có thể chia thành vertical slices; chỉ triển khai slice đã có DB/API contract liên quan được duyệt.
- Không cập nhật Product Spec để hợp thức hóa code đã làm sai yêu cầu. Nếu cần thay đổi nghiệp vụ, phải cập nhật/duyệt yêu cầu trước.

---

## 2. Phân công phối hợp nhóm 6 người

Phân công theo cơ cấu đã thống nhất: **2 Backend, 3 Frontend, 1 Documentation/Report/Slides**. Tên thành viên cụ thể do nhóm điền; không tự gán tên khi chưa có danh sách chính thức.

| Thành viên | Vai trò | Ownership chính | Phối hợp / Reviewer |
|---|---|---|---|
| TV1 | Backend Lead | Backend architecture, Identity/Auth/RBAC, cross-domain orchestration, security, DB/API integration | Review BE2; phối hợp FE Lead |
| TV2 | Backend Developer | Game/GameRule, GameRoom, RoomParticipant, DMAssignment, Session/Scheduling, Payment/Refund, background jobs theo phân công | Review BE1; hỗ trợ integration |
| TV3 | Frontend Lead | Frontend architecture, UI system, routing/layout, shared components, public Home, Game discovery/detail | Review FE2/FE3; phối hợp BE1 |
| TV4 | Frontend Developer | Player flows: Auth, GameRoom discovery/detail, create/join/leave, booking flow | Review chéo với FE3 |
| TV5 | Frontend Developer | DM/Admin portals, scheduling/session/payment UI, notification, responsive và E2E UI support | Review chéo với FE2 |
| TV6 | Documentation Lead | Product/technical docs, ERD documentation, API docs, test evidence compilation, report, presentation slides, demo script | Thu thập đầu ra từ tất cả thành viên; không tự quyết schema/API |

### 2.1. Ownership không đồng nghĩa làm việc biệt lập

- Backend Lead chịu trách nhiệm consistency của backend, nhưng không phải người duy nhất code backend.
- Frontend Lead chịu trách nhiệm consistency của frontend, nhưng không phải người duy nhất code frontend.
- TV6 điều phối tài liệu và báo cáo; các owner kỹ thuật vẫn phải cung cấp nội dung và bằng chứng chính xác.
- Mỗi module có một owner chính và ít nhất một reviewer.
- QA là trách nhiệm của toàn nhóm; mỗi owner phải viết test cho phần mình phụ trách.
- ERD và API Contract phải được review bởi cả Backend, Frontend và Documentation Lead trước khi nghiệm thu.

### 2.2. Quy tắc phối hợp Backend–Frontend

1. Backend owner đề xuất contract dựa trên DB design và Product Spec.
2. Frontend owner review khả năng sử dụng của contract và các trạng thái UI cần hiển thị.
3. Hai bên thống nhất request, response, error, authorization, pagination và idempotency trước khi tích hợp.
4. Documentation Lead cập nhật OpenAPI/API docs từ quyết định đã thống nhất; không tự thiết kế thay kỹ sư.
5. Khi contract đổi, cập nhật docs và thông báo các owner bị ảnh hưởng trước khi merge.
6. Không dùng mock response tự nghĩ để thay thế API Contract. Mock data chỉ dùng theo schema contract đã duyệt.

### 2.3. Nhịp điều hành nhóm

- Daily sync ngắn: Done / Doing / Blocked / Next.
- Mỗi blocker phải có owner và thời điểm cần xử lý.
- PR nhỏ theo feature; không gom nhiều domain không liên quan vào một PR.
- Code review ít nhất một người khác owner.
- TV6 cập nhật bảng tiến độ và danh sách deliverables; không tự đánh dấu Done nếu chưa có bằng chứng.
- Cuối mỗi tuần tổ chức milestone review và cập nhật rủi ro.

---

## 3. Timeline tổng thể 4 tuần

Timeline là kế hoạch mục tiêu, không phải cam kết rằng mọi tính năng đều hoàn thành bất kể blocker. Ưu tiên P0 end-to-end, không mở rộng P1 khi P0 chưa ổn định.

### 3.1. Milestone tổng quan

| Tuần | Trọng tâm | Backend | Frontend | Documentation | Milestone |
|---|---|---|---|---|---|
| Week 1 | Audit + Phase 5 Database Design | Audit backend/data; phân tích domain; ERD/schema/constraints | Audit UI requirements; thiết kế lại IA, wireframe, design system, app shell không phụ thuộc API | Tổng hợp baseline, cập nhật Product/Plan, hoàn thiện ERD/data dictionary cùng BE | M1: Repo baseline + DB Design được review/Accepted |
| Week 2 | Phase 6 API Contract & Jobs + foundation | OpenAPI, DTO/error/auth matrix, job catalog; khởi tạo backend foundation theo gate | Hoàn thiện frontend architecture, routing/layout, shared components; tích hợp API client sau contract | API docs, decision log, test matrix, setup guide | M2: API Contract/Jobs được review/Accepted + skeleton chạy |
| Week 3 | Phase 7 — Core vertical slices | Auth, Game/GameRoom/Participant, DM assignment, scheduling/session theo ưu tiên P0 | Auth, public discovery, Player flows, DM/Admin core screens | Cập nhật API/ERD docs theo implementation; thu thập test evidence | M3: Core booking flow tích hợp được |
| Week 4 | Payment, notification, E2E, stabilization, report | Payment/refund, deadline jobs, consistency, fixes | Payment/notification UI, responsive, E2E fixes | Test report, user guide, report, slides, demo script | M4: MVP demo + handover |

### 3.2. Kế hoạch chi tiết theo tuần

#### Week 1 — Audit và Phase 5 Database Design

**Mục tiêu:** Không code nghiệp vụ trên giả định; xác minh source/repo và thiết kế dữ liệu mới.

| Owner | Công việc | Deliverable |
|---|---|---|
| TV1 | Audit repo chính thức, backend hiện có, cấu hình Java/Maven/PostgreSQL; phân tích Identity, RBAC, transaction boundaries | Backend audit report; DB design input |
| TV2 | Phân tích domain Game, GameRoom, Participant, DM, Session, Payment, Refund, Notification | Domain-to-data inventory |
| TV3 | Audit UI/product flows theo Product Spec; xác định frontend routes, layout, design system và component boundaries mới | Frontend architecture proposal, wireframes |
| TV4 | Phân rã Player journeys: public discovery, auth, create/join/leave, booking | Player flow map |
| TV5 | Phân rã DM/Admin journeys, scheduling, payment, notification và responsive states | DM/Admin flow map |
| TV6 | Quản lý tài liệu; cùng BE tổng hợp ERD, data dictionary, quyết định và biên bản review | `ERD`, `DATA_DICTIONARY`, `PHASE_5_REVIEW` |

**M1 Acceptance:**
- Đã xác minh đúng repository chính thức và trạng thái working tree.
- Repo tham khảo được audit chỉ đọc, không dùng làm base code.
- Frontend rebuild scope được ghi rõ.
- ERD bao phủ domain cần thiết và phân biệt GameRoom/PhysicalRoom.
- Cardinality, FK, unique constraints, indexes quan trọng được giải thích.
- Đã phân tích transaction/locking cho slot cuối, active participation, payment/deadline và cancellation.
- Không còn bảng/quan hệ trọng yếu chưa được giải thích; các quyết định chưa chốt được ghi OPEN.
- Người dùng/nhóm xác nhận Phase 5 trước khi triển khai migration nghiệp vụ.

#### Week 2 — Phase 6 API Contract & Background Jobs

**Mục tiêu:** FE/BE có cùng contract để phát triển song song.

| Owner | Công việc | Deliverable |
|---|---|---|
| TV1 | Thiết kế auth/security contract, error model, resource authorization, idempotency conventions | API security/auth sections |
| TV2 | Thiết kế API Game/GameRoom/Participant/DM/Session/Payment và job catalog theo ownership | OpenAPI paths, job specification |
| TV3 | Hoàn thiện frontend app shell, route map, shared UI, API client structure và type strategy | Frontend skeleton |
| TV4 | Xây dựng Player UI theo route map và contract được duyệt; form/validation states | Player UI skeleton |
| TV5 | Xây dựng DM/Admin UI shell, tables/forms/status views và responsive base | DM/Admin UI skeleton |
| TV6 | Tổng hợp OpenAPI docs, error code catalog, auth matrix, job schedule và test scenarios | `API_CONTRACT`, `BACKGROUND_JOBS`, `API_TEST_MATRIX` |

**M2 Acceptance:**
- API Contract thống nhất method/path/request/response/status/error/auth.
- Không trả persistence entity trực tiếp.
- Mỗi command thay đổi trạng thái là business action; client không gửi status đích.
- API nhạy cảm có authorization matrix và resource-level checks.
- Idempotency/concurrency được chỉ rõ cho join/rejoin, payment, deadline và admin cancellation.
- Job catalog có trigger, eligibility, locking, idempotency, retry/failure behavior.
- Frontend và Backend skeleton build được; lệnh chạy local được ghi nhận.
- Người dùng/nhóm xác nhận Phase 6 trước khi mở rộng implementation phụ thuộc.

#### Week 3 — Phase 7: Core implementation

**Mục tiêu:** Hoàn thành luồng cốt lõi từ Guest/Player đến GameRoom, DM và Session.

| Owner | Công việc | Deliverable |
|---|---|---|
| TV1 | Backend Identity/Auth/RBAC, global exception handling, security, audit foundation | Auth API + tests |
| TV2 | Backend Game/GameRoom/Participant, DM assignment, scheduling/session core theo contract | Core domain APIs + tests |
| TV3 | Frontend Home, Game list/detail, shared layout, navigation, API integration | Public discovery |
| TV4 | Frontend Auth, Player GameRoom list/detail/create/join/leave | Player core flow |
| TV5 | Frontend DM/Admin assignment/scheduling/session screens | DM/Admin core flow |
| TV6 | Cập nhật docs, test evidence, hướng dẫn chạy và demo flow giữa kỳ | Midpoint report |

**M3 Acceptance:**
- Guest xem được public Home/Game/GameRoom theo quyền công khai.
- Register/Login/Logout và RBAC backend hoạt động.
- Player tạo/join/leave GameRoom theo đúng rule.
- Rejoin tạo participant record mới; không mutate record cũ.
- Admin assign/reassign DM; DM accept/reject đúng quyền.
- Schedule/Session transitions tuân thủ Phase 4 Accepted.
- Có ít nhất một luồng core UI → API → Service → DB → UI chạy thực tế.
- Các test trọng yếu và migration liên quan chạy được.

#### Week 4 — Payment, notification, regression và handover

**Mục tiêu:** Hoàn thiện phần payment/refund/deadline, tích hợp toàn hệ thống, sửa lỗi và chuẩn bị demo.

| Owner | Công việc | Deliverable |
|---|---|---|
| TV1 | Review security, transaction boundaries, cancellation orchestration, integration fixes | Security/integration report |
| TV2 | Mock payment, deposit/remaining, refund, deadline jobs, notification persistence và audit | Payment/job APIs + tests |
| TV3 | Hoàn thiện responsive, shared UI consistency, error/loading/empty states | Frontend polish |
| TV4 | Hoàn thiện Player payment/booking/notification UI và E2E Player journey | Player E2E |
| TV5 | Hoàn thiện DM/Admin payment confirmation, refund, notification và E2E | DM/Admin E2E |
| TV6 | Regression evidence, final report, slides, demo script, setup guide và known limitations | Final documentation package |

**M4 Acceptance:**
- Deposit 30%/Remaining theo quy tắc Accepted.
- Deadline 2 giờ per participant và reminder đúng mốc.
- Refund workflow và Admin decision đúng policy.
- Background jobs idempotent, có test và log cần thiết.
- Notification Center lưu DB và polling hoạt động.
- E2E P0 chạy được; critical/high bugs được xử lý hoặc công khai.
- Build/test/migration/setup được xác minh trên môi trường sạch phù hợp.
- Báo cáo, slides, demo script và README hoàn tất.

### 3.3. Quy tắc ưu tiên khi trễ tiến độ

1. Giữ nguyên correctness/security của P0; không bỏ test race/payment để chạy theo deadline.
2. Ưu tiên vertical slice hoàn chỉnh thay vì nhiều màn hình tĩnh.
3. P1 và polish không thiết yếu được chuyển backlog.
4. Không rút ngắn Phase 5/6 bằng cách tự suy diễn ERD/API.
5. Nếu cần giảm scope, nhóm phải nêu rõ tính năng bị cắt và xin xác nhận; không âm thầm đổi Product Spec.

---

## 4. Phase 0 — Repository Audit, Source Protection & Environment Baseline

**Mục tiêu:** Biết source chính thức hiện có gì, trạng thái nào, có thể chạy đến đâu và phần nào cần thay mới. Phase này không phải lý do để trì hoãn vô thời hạn việc thiết kế/implementation.

### 4.1. Sub-phase 0.1 — Xác minh repository chính thức

**Tasks**
1. Mở `nguyenxuanhieu2903/kich-ban-sat`.
2. Kiểm tra remote, branch, commit gần nhất và `git status`.
3. Kiểm tra cấu trúc frontend/backend/docs.
4. Ghi nhận file thay đổi chưa commit và người sở hữu nếu biết.
5. Xác định default branch, branch protection/ruleset và quyền merge.
6. Không reset, checkout phá hủy, clean hoặc xóa file chưa hiểu.

**Deliverables**
- `docs/project/REPOSITORY_AUDIT.md`
- Snapshot branch/status/commit.
- Danh sách file/thay đổi cần bảo vệ.

**Acceptance**
- Xác định đúng repo chính thức.
- Working tree sạch/dirty được ghi rõ.
- Không có file bị xóa/ghi đè trong audit.

### 4.2. Sub-phase 0.2 — Audit repository tham khảo (read-only)

**Tasks**
1. Đọc `Danh-K/FE_Kich_Ban_Sat` ở chế độ chỉ đọc.
2. Ghi nhận các luồng nghiệp vụ, màn hình và edge cases có ích.
3. Đối chiếu từng quan sát với Product Spec V15 Final.
4. Phân loại `REFERENCE_ONLY`, `REJECTED`, `NEEDS_REVIEW`.
5. Không copy source, component, API, schema hoặc migration.
6. Nếu xem xét tái sử dụng một asset/code cụ thể, phải review license/security/dependency riêng và xin xác nhận.

**Deliverables**
- `docs/project/REFERENCE_REPOSITORY_AUDIT.md`
- Business flow observations và gap list.

**Acceptance**
- Mọi nhận xét có bằng chứng từ repo tham khảo.
- Không xem repo tham khảo là source of truth.
- Không có thay đổi được push vào repo tham khảo.

### 4.3. Sub-phase 0.3 — Source protection và backup

**Tasks**
1. Kiểm tra `git status`, branch và diff trước mọi thao tác.
2. Tạo branch làm việc theo workflow nhóm.
3. Với file local chưa commit quan trọng, tạo bản backup ngoài working tree hoặc commit checkpoint sau review.
4. Xác định file generated, local config, `.env`, uploads và database data cần bảo vệ.
5. Kiểm tra `.gitignore`; không xóa file chỉ vì nghi là generated.
6. Chỉ thực hiện refactor/delete sau khi xác định owner, usage và tác động.

**Deliverables**
- Source protection checklist.
- Backup/checkpoint record.
- Danh sách vùng code được phép chỉnh sửa.

**Acceptance**
- Có thể quay lại trạng thái trước thay đổi.
- Không có thao tác destructive chưa được chấp thuận.
- Không commit secret.

### 4.4. Sub-phase 0.4 — Kiểm tra khả năng chạy source và môi trường

**Tasks**
1. Kiểm tra Node.js/npm và lockfile để xác định package manager.
2. Kiểm tra `package.json` scripts; không tự đoán lệnh.
3. Kiểm tra Java 21, Maven/Maven Wrapper, `pom.xml`.
4. Kiểm tra PostgreSQL native, port và quyền truy cập; không xóa database.
5. Chạy frontend/backend hiện có nếu đủ cấu hình.
6. Chạy build/lint/test nếu scripts hỗ trợ.
7. Ghi lại lỗi startup/build thực tế và cách tái hiện.
8. Không cài lại công cụ đang hoạt động đúng.

**Deliverables**
- `docs/project/LOCAL_ENVIRONMENT_BASELINE.md`
- Lệnh chạy thực tế.
- Log/error và blocker list.

**Acceptance**
- Frontend/backend được phân loại `RUNS`, `RUNS_WITH_ISSUES`, `BLOCKED` hoặc `NOT_PRESENT`.
- Không ghi PASS nếu chưa chạy.
- Có danh sách blocker và owner.

### 4.5. Sub-phase 0.5 — Frontend rebuild decision

**Tasks**
1. Đọc Product Spec V15 Final, route/use-case inventory.
2. Xác định app structure mới theo feature-oriented organization phù hợp.
3. Thiết kế lại UI/UX, routing, layouts, components, state management, API client.
4. Xác định design tokens, responsive breakpoints, accessibility baseline.
5. Chỉ khảo sát source cũ để hiểu flow/edge cases; không lấy cấu trúc cũ làm mặc định.
6. Lập kế hoạch thay thế theo route/feature để tránh làm mất chức năng đang chạy.
7. Không thay đổi framework đã xác nhận nếu không có lý do kỹ thuật và phê duyệt.

**Deliverables**
- `docs/frontend/FRONTEND_ARCHITECTURE.md`
- Route map.
- Component inventory.
- UI flow/wireframe hoặc design references.
- Migration/rebuild checklist.

**Acceptance**
- Frontend mới có architecture/route boundaries rõ.
- Mọi route P0 có owner.
- Các UI states loading/empty/error/success/disabled được tính đến.
- Không có phụ thuộc ngầm vào API cũ.

---

## 5. Phase 5 — Database Design

**Mục tiêu:** Tự thiết kế ERD và relational database dựa trên Product Spec V15 Final cùng Phase 3/4 Accepted. Không sao chép ERD/schema từ repository tham khảo.

**Gate:** Không triển khai migration nghiệp vụ chính thức trước khi Phase 5 được review và Accepted.

### 5.1. Sub-phase 5.1 — Domain/data inventory

Phân tích các domain cần lưu trữ. Danh sách dưới đây là phạm vi khảo sát, **không phải danh sách bảng đã chốt**:

- Identity: User, Role, Profile hoặc cấu trúc tương đương.
- Game: Game, GameRule/configuration, rule version/history.
- GameRoom: GameRoom, status history, creator/owner.
- RoomParticipant: participation records, status history, per-participant deadline.
- Replacement: replacement window occurrences và history.
- DM: DM profile/availability, DMAssignment và assignment history.
- Venue: PhysicalRoom, availability/reservation nếu cần.
- Scheduling/Session: ScheduleProposal, participant responses, official schedule, Session lifecycle.
- Payment: PlayerPayment/obligation, payment attempts/transactions/history.
- Refund: Refund, refund attempts/history/reference.
- Notification: Notification, recipient/read state.
- Audit: actor, action, resource, timestamp, reason và metadata cần thiết.

**Tasks**
1. Map mỗi use case/state transition sang dữ liệu cần đọc/ghi.
2. Xác định aggregate/resource ownership.
3. Xác định dữ liệu cần audit và retention.
4. Phân biệt current state với history/event records.
5. Không mặc định mỗi domain phải tương ứng đúng một bảng.

**Deliverable:** `docs/database/DOMAIN_DATA_INVENTORY.md`.

### 5.2. Sub-phase 5.2 — ERD conceptual và logical

**Tasks**
1. Xác định entity candidates và trách nhiệm từng entity.
2. Xác định PK/FK và cardinality.
3. Xác định optional/mandatory relationships.
4. Xác định unique constraints, đặc biệt active participation.
5. Xác định cách lưu status history và replacement windows.
6. Xác định payment/refund liên kết chính xác với participant/obligation/transaction.
7. Phân biệt GameRoom và PhysicalRoom.
8. Xác định rule version/history; cách áp dụng cho GameRoom đã tạo vẫn là Open Decision cho tới khi được xác nhận.

**Deliverables**
- `docs/database/ERD_CONCEPTUAL.md`
- `docs/database/ERD_LOGICAL.md`
- Source script để render ERD bằng công cụ nhóm chọn (ví dụ dbdiagram.io DSL nếu được thống nhất).

**Acceptance**
- Mọi quan hệ có cardinality và giải thích.
- Không có quan hệ many-to-many bị bỏ qua junction structure khi cần.
- Không có entity chỉ tồn tại vì copy từ source tham khảo.
- ERD đáp ứng rejoin bằng record mới và giữ lịch sử.

### 5.3. Sub-phase 5.3 — Relational schema và data dictionary

**Tasks**
1. Chốt table/column names và naming convention.
2. Chọn PostgreSQL data types theo semantics.
3. Xác định nullability/default/check constraints.
4. Xác định FK delete/update behavior.
5. Xác định precision/scale cho dữ liệu số; tiền VNĐ theo Phase 4 dùng `BIGINT`.
6. Xác định timestamp strategy/timezone.
7. Xác định enum strategy (DB enum/check/text + application mapping) và migration implications.
8. Xác định audit columns và optimistic/pessimistic locking needs.

**Deliverables**
- `docs/database/RELATIONAL_SCHEMA.md`
- `docs/database/DATA_DICTIONARY.md`.

### 5.4. Sub-phase 5.4 — Constraints, indexes và concurrency design

Bắt buộc phân tích ít nhất:

- Tối đa một active RoomParticipant cho `(game_room_id, user_id)`.
- Chống tạo vượt giới hạn active GameRoom của một user.
- Chống join/rejoin đồng thời vào slot cuối.
- Chỉ một ScheduleProposal `PROPOSED` cho mỗi GameRoom.
- Không double-book PhysicalRoom/DM trong cùng khung lịch theo policy đã chốt.
- Không duplicate payment obligation/transaction theo idempotency policy.
- Refund amount không vượt số tiền thực nhận.
- Payment/refund của participant cũ độc lập participant mới.
- Các state transitions quan trọng cần kiểm tra trạng thái mới nhất trong transaction.
- Deadline job phải xử lý lặp an toàn.

**Tasks**
1. Chọn indexes theo query patterns và FK joins.
2. Đánh giá partial/unique indexes nếu phù hợp PostgreSQL.
3. Ghi rõ isolation/locking strategy cho các critical flows.
4. Xác định transaction boundary và thứ tự lock để giảm deadlock.
5. Xác định retry behavior khi optimistic lock/unique constraint conflict.
6. Không thêm index không có query/use case giải thích.

**Deliverables**
- `docs/database/CONSTRAINTS_AND_INDEXES.md`
- `docs/database/TRANSACTION_AND_LOCKING_DESIGN.md`.

### 5.5. Sub-phase 5.5 — Flyway migration plan

**Tasks**
1. Chia migration theo dependency và thứ tự tạo bảng.
2. Tạo migration mới; không sửa migration đã chạy trên môi trường dùng chung.
3. Chuẩn bị seed data an toàn cho local/demo.
4. Xác minh migration trên database local mới.
5. Xác minh rollback/recovery strategy (Flyway thường forward-fix; không giả định rollback tự động an toàn).
6. Kiểm tra schema sau migration so với ERD/schema docs.
7. Không chứa secret hoặc dữ liệu cá nhân thật trong seed.

**Deliverables**
- `backend/src/main/resources/db/migration/` (theo cấu trúc repo thực tế).
- `docs/database/MIGRATION_PLAN.md`.
- Migration execution evidence.

### 5.6. Phase 5 Acceptance Checklist

- [ ] ERD conceptual và logical được review.
- [ ] Data dictionary đầy đủ cho các bảng P0.
- [ ] GameRoom và PhysicalRoom tách biệt.
- [ ] Rejoin tạo participant record mới, giữ record cũ.
- [ ] Payment/refund gắn đúng participant/obligation.
- [ ] Unique constraints bảo vệ active participation và các invariants quan trọng.
- [ ] Indexes gắn với query patterns.
- [ ] Transaction/locking strategy được mô tả cho concurrency risks.
- [ ] Migration chạy trên PostgreSQL local mới.
- [ ] Không copy ERD/schema/migration từ repo tham khảo.
- [ ] Open Decisions về data được ghi rõ, không tự suy diễn.
- [ ] Nhóm/người dùng xác nhận Phase 5.

---

## 6. Phase 6 — API Contract & Background Jobs

**Mục tiêu:** Thiết kế API Contract mới dựa trên Product Spec V15 Final và Database Design đã duyệt. Xác định rõ background jobs/deadlines, idempotency, retry, authorization và error handling.

**Gate:** Không triển khai song song FE/BE theo contract chưa được thống nhất.

### 6.1. Sub-phase 6.1 — API conventions

**Tasks**
1. Chốt base path/versioning (định hướng `/api/v1`, xác nhận trong contract).
2. Chốt HTTP method semantics.
3. Chốt pagination/filter/sort conventions.
4. Chốt request validation conventions.
5. Chốt response envelope (nếu dùng) và date/time format.
6. Chốt error response structure và error code naming.
7. Chốt correlation/request ID và logging policy.
8. DTO không expose persistence entities.

**Deliverable:** `docs/api/API_CONVENTIONS.md`.

### 6.2. Sub-phase 6.2 — API inventory và contract theo domain

API groups dự kiến (capability groups, không phải endpoint đã chốt):
- Authentication/profile.
- Public Game list/detail.
- GameRoom list/detail/create/join/rejoin/leave/edit/history.
- Admin GameRoom cancel/reopen/decision/history.
- RoomParticipant leave request/decision/deposit state/history.
- DM assignment list/detail/accept/reject/availability.
- Admin DM assignment/reassignment/revocation.
- PhysicalRoom management.
- ScheduleProposal create/respond/cancel/confirm.
- Session start/complete/cancel.
- Payment deposit/remaining/status/transaction history.
- Refund request/review/processing/result/history.
- Notification list/unread/read/polling.
- Audit/history queries by role/resource.

**Tasks**
1. Gắn mỗi use case với API command/query.
2. Ghi actor/role/resource authorization.
3. Xác định request/response DTO và validation.
4. Xác định status codes và error codes.
5. Xác định idempotency key/duplicate handling.
6. Xác định optimistic version/ETag nếu phù hợp.
7. Xác định API polling incremental/cursor để tránh tải lại toàn bộ dữ liệu.
8. Đối chiếu contract với ERD và transaction boundary.

**Deliverable:** `docs/api/API_CONTRACT.md` và OpenAPI file.

### 6.3. Sub-phase 6.3 — Authorization matrix

Mỗi endpoint/command cần mô tả:
- Guest/anonymous access.
- PLAYER role.
- DM role.
- ADMIN role.
- Resource ownership/current assignment checks.
- State-based guards.
- Reason-required actions.
- Data visibility and field-level exposure.

Bắt buộc kiểm tra:
- DM chỉ thao tác assignment/session đang được phân công.
- Player chỉ truy cập dữ liệu cá nhân và participation thuộc quyền.
- Không dựa vào frontend route guard thay backend authorization.
- Admin-only operations có reason bắt buộc khi Product Spec yêu cầu.
- Chống IDOR trên GameRoom, RoomParticipant, Payment, Refund, Session.

**Deliverable:** `docs/api/AUTHORIZATION_MATRIX.md`.

### 6.4. Sub-phase 6.4 — Background job catalog

Các job cần đánh giá/đặc tả:
- GameRoom initial formation expiry: 4 giờ, chỉ khi còn `FORMING`.
- Participant deposit deadline: 2 giờ riêng từng participant/obligation.
- Deposit reminders: còn 1 giờ và 30 phút, gắn đúng deadline.
- Replacement window expiry: 30 phút–4 giờ, không vượt session start; hết hạn chuyển sang Admin decision, không auto-cancel.
- ScheduleProposal expiry: 2 giờ; chưa đủ 100% đồng ý thì `REJECTED`.
- Payment reconciliation khi có transaction in-flight/unknown.
- Refund retry là thao tác Admin thủ công; không tự retry ngoài policy đã Accepted.
- Notification delivery/polling support.

Mỗi job phải có:
- Trigger/schedule/time source.
- Query eligibility.
- State guard trước update.
- Transaction boundary.
- Locking/concurrency strategy.
- Idempotency key hoặc equivalent.
- Retry/backoff/failure handling.
- Logging/metrics cần thiết.
- Test cases cho duplicate, late execution và race.

**Deliverable:** `docs/jobs/BACKGROUND_JOBS.md`.

### 6.5. Sub-phase 6.5 — API/job test contract

**Tasks**
1. Viết API examples cho happy path và lỗi chính.
2. Viết contract tests hoặc schema validation strategy.
3. Viết job test matrix: early/on-time/late/repeated/concurrent.
4. Xác định payment timestamp authority theo server received timestamp.
5. Xác định idempotency semantics cho retry và duplicate requests.
6. Xác định notification failure không rollback business transaction đã commit.
7. Review toàn bộ contract với BE, FE, Documentation Lead.

**Deliverables**
- `docs/api/API_EXAMPLES.md`
- `docs/jobs/JOB_TEST_MATRIX.md`
- OpenAPI lint/validation evidence nếu toolchain hỗ trợ.

### 6.6. Phase 6 Acceptance Checklist

- [ ] REST/JSON conventions được thống nhất.
- [ ] OpenAPI/API Contract có request/response/error cho P0 endpoints.
- [ ] Không expose persistence entity.
- [ ] Authorization matrix bao phủ role và resource authorization.
- [ ] Command API không cho client tự chọn status đích.
- [ ] Join/rejoin/payment/deadline/cancel có idempotency/concurrency policy.
- [ ] Background job catalog có schedule/guard/locking/retry/failure behavior.
- [ ] API polling có pagination/incremental strategy.
- [ ] Contract được đối chiếu ERD và Product Spec.
- [ ] Frontend/Backend owners xác nhận contract.
- [ ] Nhóm/người dùng xác nhận Phase 6.

---

## 7. Phase 7 — Implementation & Testing

**Mục tiêu:** Backend và Frontend triển khai song song trong repository chính thức, theo API Contract đã duyệt và từng vertical slice. Frontend được xây dựng lại; không mặc định kế thừa source cũ.

### 7.1. Sub-phase 7.1 — Project foundation

**Backend**
1. Chuẩn hóa Spring Boot project theo Java 21/Spring Boot 3.x/Maven.
2. Áp dụng Feature-oriented + Layered Architecture.
3. Tách API/controller, application/service, domain, infrastructure/persistence theo nhu cầu.
4. Cấu hình Spring Security, exception handling, validation, logging.
5. Cấu hình PostgreSQL qua environment/local config.
6. Cấu hình Flyway.
7. Tạo health check phù hợp.
8. Không tạo abstraction không cần thiết.

**Frontend**
1. Khởi tạo/cấu trúc lại Next.js + React + TypeScript trong repo chính thức.
2. Thiết kế app routes/layouts theo public, Player, DM, Admin.
3. Tạo design tokens/theme, typography, spacing, responsive rules.
4. Tạo shared components và form primitives.
5. Tạo typed API client theo OpenAPI/contract.
6. Xác định auth/session handling theo security design được duyệt.
7. Chuẩn hóa loading/empty/error/success states.
8. Không hardcode API response shape ngoài contract.

**Deliverables**
- Backend/frontend skeleton.
- README local run.
- `.env.example` không chứa secret.
- Build/smoke test evidence.

### 7.2. Sub-phase 7.2 — Public Home, Game Discovery & Identity

**Backend**
- Public Game list/detail và public GameRoom list/detail theo visibility policy.
- Register tạo role `PLAYER`.
- Login/logout/current user.
- Spring Security RBAC.
- Resource-level authorization.
- Validation và error response thống nhất.

**Frontend**
- Public Home.
- Game listing/detail.
- Public GameRoom listing/detail.
- Register/Login/Logout.
- Role-based navigation.
- Route guard chỉ phục vụ UX; backend vẫn bảo vệ độc lập.

**Tests**
- Guest public access.
- Guest protected action bị chặn.
- Duplicate identity.
- Wrong credentials.
- Role escalation attempt.
- IDOR/private field leakage.
- Direct URL refresh/navigation.

**Exit criteria**
- Guest khám phá được nội dung công khai.
- Auth/RBAC chạy với API thật.
- Frontend hiển thị đúng role/state.

### 7.3. Sub-phase 7.3 — GameRule, GameRoom & RoomParticipant

**Backend**
1. Game/GameRule model theo DB design.
2. Rule evaluation service cho các rule đã xác nhận.
3. GameRoom aggregate và status transition service.
4. RoomParticipant lifecycle.
5. Create/join/rejoin/leave commands.
6. Creator identity lấy từ authenticated principal.
7. Validate start time theo policy.
8. Enforce giới hạn active GameRoom theo Product Spec.
9. Active participation unique constraint.
10. Status history/audit.
11. Transaction/locking cho simultaneous join slot cuối.
12. Re-evaluate GameRoom conditions sau thay đổi participant.

**Frontend**
- Create GameRoom form.
- Public GameRoom list/detail.
- Join/rejoin/leave interactions.
- Participant list/status.
- Error/loading/empty/confirmation states.
- Không cho client tự gửi creatorId, status, amount hoặc business condition không được phép.

**Accepted rules phải giữ**
- GameRoom states: `FORMING`, `WAITING_FOR_DM`, `WAITING_FOR_ORGANIZATION`, `WAITING_FOR_DEPOSIT`, `REPLENISHING`, `WAITING_FOR_ADMIN_DECISION`, `READY_FOR_SESSION`, `COMPLETED`, `EXPIRED`, `CANCELLED`.
- RoomParticipant states: `PENDING_DEPOSIT`, `DEPOSITED`, `LEAVE_REQUESTED`, `LEFT`, `CANCELLED_UNPAID`, `CANCELLED_BY_ADMIN`.
- Initial formation timeout 4 giờ chỉ áp dụng khi `FORMING`.
- Mỗi participant có deposit deadline riêng; participant mới không reset deadline participant cũ.
- `READY_FOR_SESSION` yêu cầu điều kiện game/tổ chức hợp lệ, active participants không rỗng và tất cả active participants đã deposit 30%; không yêu cầu remaining 70%.
- `LEAVE_REQUESTED` vẫn active cho tới quyết định Admin.
- `LEFT`/`CANCELLED_UNPAID` rejoin tạo record mới; không giới hạn số lần trong MVP nếu room cho phép.
- Rejoin khi refund cũ pending vẫn được phép; payment/refund cũ và mới độc lập.
- Participant terminal không được tái kích hoạt.
- DM/schedule change sau READY đưa GameRoom về `WAITING_FOR_ORGANIZATION`.

**Tests**
- Mọi valid/invalid transitions.
- Terminal states.
- Simultaneous join/rejoin slot cuối.
- Duplicate join.
- Rejoin creates new record.
- LEAVE_REQUESTED remains active.
- Empty participant list không làm READY sai.
- Formation timeout race.
- Late/duplicate payment không hồi sinh terminal participant.

### 7.4. Sub-phase 7.4 — Admin operations & DM Assignment

**Backend**
- DM profile/availability theo DB/API design.
- Admin assign/reassign DM.
- DM accept/reject; reject reason bắt buộc.
- Admin cancel pending assignment.
- Admin revoke accepted assignment trước Session `IN_PROGRESS`/`COMPLETED`, reason bắt buộc.
- Audit assignment history.
- Resource authorization: đúng DM được phân công mới được thao tác.

**Frontend**
- Admin DM list/detail.
- Admin assign/reassign/revoke flows.
- DM assigned rooms/assignments.
- Accept/reject UI, reject reason.
- Assignment status/history.

**Accepted rules**
- DMAssignment states: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`.
- Không timeout tự động cho `PENDING`.
- Admin được thu hồi assignment `ACCEPTED` trước khi Session `IN_PROGRESS`/`COMPLETED`; reason bắt buộc.
- Thu hồi accepted assignment đưa GameRoom về `WAITING_FOR_ORGANIZATION`.

**Tests**
- Admin assign/reassign.
- DM accept/reject.
- Wrong DM denied.
- Revoke accepted assignment with/without reason.
- No automatic timeout.
- Concurrent assignment conflict.

### 7.5. Sub-phase 7.5 — PhysicalRoom, ScheduleProposal & Session

**Backend**
- PhysicalRoom CRUD/availability theo quyền.
- ScheduleProposal create/respond/cancel/expire.
- Validate capacity, DM availability, schedule conflicts và 12-hour preparation.
- Session create/start/complete/cancel.
- Session actual start/end timestamps.
- Reservation release và audit.
- Transaction/locking chống double-booking.

**Frontend**
- Admin PhysicalRoom management.
- Admin schedule proposal/confirmation.
- Player schedule response.
- DM session detail/start/complete.
- Admin emergency cancellation UI.
- Display official schedule/history.

**Accepted rules**
- ScheduleProposal states: `PROPOSED`, `CONFIRMED`, `REJECTED`, `CANCELLED`.
- Tối đa một proposal `PROPOSED` trên mỗi GameRoom.
- 100% active participants phải đồng ý trong 2 giờ, không vượt giờ chơi cũ.
- Bất kỳ participant active từ chối hoặc hết hạn mà chưa đủ 100% => `REJECTED`; giữ lịch cũ.
- Session states: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.
- DM được phân công hoặc Admin có thể start Session từ điều kiện hợp lệ `READY_FOR_SESSION`.
- Chỉ Admin được emergency-cancel Session `IN_PROGRESS`; reason bắt buộc.
- DM preparation tối thiểu 12 giờ theo policy trong Product Spec.
- DM/schedule change sau READY đưa GameRoom về `WAITING_FOR_ORGANIZATION`.

**Tests**
- Proposal 100% accept / one reject / timeout.
- Max one active proposal.
- Preserve old schedule on reject/cancel.
- DM availability/collision.
- PhysicalRoom capacity/conflict.
- Exact 12-hour boundary.
- Session start/complete permissions.
- Emergency cancellation authorization/reason.
- Double booking concurrency.

### 7.6. Sub-phase 7.6 — PlayerPayment, Mock Payment & Refund

**Backend**
1. PlayerPayment lifecycle theo Phase 4 Accepted.
2. Tính giá vé cố định/người ở Backend.
3. Tính deposit 30%, làm tròn lên bội số 1.000 VNĐ.
4. Remaining = total - deposit.
5. Deposit deadline 2 giờ.
6. Retry không giới hạn trong hạn 2 giờ theo policy Accepted.
7. Server request receipt timestamp là nguồn chuẩn xử lý deadline race.
8. Mock payment result do Backend/test fixture kiểm soát; Player không gửi kết quả thành công.
9. Cash confirmation chỉ bởi Admin hoặc DM đang được phân công, chỉ áp dụng Remaining theo Product Spec.
10. Refund workflow do Admin xử lý thủ công với reference/notes.
11. Refund retry thủ công không giới hạn khi FAILED.
12. Refund không vượt số tiền đã thực nhận.
13. Admin quyết định hoàn 100% hoặc 0% khi Player xin rời sau deposit; reason bắt buộc.
14. Lưu payment/refund attempts/history; không xóa giao dịch cũ.
15. Reconcile payment in-flight trước khi đóng participant/room.

**Frontend**
- Payment summary.
- Deposit/remaining amount và deadline theo server state.
- Mock payment action theo contract.
- Cash confirmation action cho actor có quyền.
- Refund status, Admin processing form và reference/notes.
- Transaction history.
- Pending/failure/success/expired states.

**Accepted rules**
- PlayerPayment states: `NOT_OPEN`, `DEPOSIT_PENDING`, `PARTIALLY_PAID`, `PAID`, `EXPIRED`, `CANCELLED`.
- Tiền VNĐ dùng `BIGINT`.
- Giá vé cố định/người.
- Deposit 30% làm tròn lên hàng nghìn.
- Remaining = total - deposit.
- Retry payment không giới hạn trong hạn 2 giờ.
- Refund states: `REQUESTED`, `PROCESSING`, `SUCCEEDED`, `FAILED`, `REJECTED`.
- Refund là lifecycle riêng; không gộp với participant status.
- Refund thất bại có thể retry thủ công không giới hạn.
- Lưu mã tham chiếu/ghi chú khi Admin xác nhận kết quả refund.

**Tests**
- Deposit rounding boundary.
- Remaining calculation.
- Deadline exact boundary.
- Retry within 2h.
- Duplicate request/callback.
- Server timestamp race.
- Late success after participant terminal.
- Cash confirmation role restriction.
- Refund amount <= collected.
- Refund success/failure/retry/reject.
- Rejoin while old refund pending keeps payment histories independent.
- Room cancellation vs in-flight payment reconciliation.

### 7.7. Sub-phase 7.7 — Replacement, cancellation & cross-domain orchestration

**Backend**
- Admin open/reopen replacement window với reason.
- Mỗi window là record mới; lưu `reopen_count`/history.
- Validate 30 phút–4 giờ và không vượt session start.
- Replacement participant có participant record và deadline riêng.
- Hết replacement window khi thiếu điều kiện => `WAITING_FOR_ADMIN_DECISION`, không auto-cancel.
- Admin cancel mọi GameRoom nonterminal; reason bắt buộc.
- Cancellation orchestration đóng active participants, assignment/session/reservation, payment/refund theo accepted policy và audit.
- Không xóa transaction đang PROCESSING; reconciliation theo policy.
- Cross-domain coordination qua application service/domain event trong cùng backend; không thêm message broker nếu chưa có nhu cầu.

**Frontend**
- Admin replacement controls, window history, reopen/cancel reason.
- Player join replacement flow.
- Room status/history.
- Cancellation and refund status visibility.

**Tests**
- Window min/max/session-start boundary.
- Reopen multiple times creates new record.
- Deadline expiry does not auto-cancel.
- Cancel from every nonterminal GameRoom state.
- Cancel requires reason.
- Cancel-vs-join/payment/DM accept/schedule race.
- Resource release and refund side effects.
- Idempotent cross-domain event handling.

### 7.8. Sub-phase 7.8 — Notification Center, Polling & Audit

**Backend**
- Notification persistence and recipient authorization.
- Read/unread state.
- List/unread count/mark read APIs.
- Incremental query/pagination.
- Event-to-notification mapping.
- Audit/history query APIs.
- Polling-compatible response.
- Notification failure không rollback business transaction đã commit.

**Frontend**
- Shared Notification Center.
- Read/unread state.
- Polling theo interval đã chốt.
- Tránh overlapping requests; pause/backoff khi phù hợp.
- Loading/empty/error states.
- Player/DM/Admin history views theo quyền.

**Tests**
- Notification recipient isolation.
- Read/unread.
- Duplicate event does not create duplicate notification.
- Polling incremental and pagination.
- Notification failure does not roll back business transaction.
- Audit visibility and immutability.

### 7.9. Phase 7 Definition of Done

Một vertical slice chỉ Done khi:
- DB migration liên quan chạy được.
- API đúng contract và authorization matrix.
- Backend validation/business rules hoạt động.
- Frontend gọi API thật, không chỉ mock.
- Có loading/empty/error/success states.
- Unit/integration/API/UI tests phù hợp đã chạy.
- Có smoke test UI → API → DB → UI.
- Có `git diff` review, không lộ secret/file ngoài scope.
- Có evidence và known issues.
- Có Git checkpoint hoặc lý do rõ chưa commit.

---

## 8. Quy trình vận hành lặp lại cho từng Sub-phase

### Step 1 — Load context
- Đọc `PRODUCT_SPEC_V15_Final.md`.
- Đọc Implementation Plan phần tương ứng.
- Đọc ERD/API/Job docs đã được Accepted.
- Kiểm tra branch, `git status`, `git diff`, commit gần nhất.

### Step 2 — Define scope
- Ghi rõ chức năng đang làm.
- Liệt kê file/module dự kiến thay đổi.
- Xác định API, DB, UI và test bị ảnh hưởng.
- Xác định Open Decision có liên quan.
- Không mở rộng sang phase khác.

### Step 3 — Update documentation just enough
- Cập nhật business rule reference nếu có thay đổi được duyệt.
- Cập nhật ERD/migration plan nếu data thay đổi.
- Cập nhật API contract trước khi FE/BE tích hợp.
- Cập nhật test cases.
- Không viết lại tài liệu không liên quan.

### Step 4 — Implement
- Backend theo feature/layer boundary.
- Frontend theo route/feature/component boundary.
- Database chỉ thay đổi qua Flyway migration mới.
- Background jobs có idempotency, locking, retry và observability phù hợp.
- Không để business logic quan trọng trong UI/controller.

### Step 5 — Run locally
Chạy các service liên quan:
- PostgreSQL native.
- Backend Spring Boot native.
- Frontend Next.js native.

Lệnh cụ thể phải lấy từ repository thực tế (`package.json`, Maven Wrapper, README), không tự đoán scripts hoặc package manager.

### Step 6 — Verify
- Unit tests.
- Integration tests.
- API/contract tests.
- Frontend lint/build/test.
- Manual smoke test.
- Migration test nếu có thay đổi schema.
- Security/concurrency tests tương ứng.

### Step 7 — Review diff
- `git diff --check`.
- Kiểm tra file ngoài scope.
- Kiểm tra secret, `.env`, build output.
- Kiểm tra dependency mới.
- Kiểm tra migration và dữ liệu hiện hữu.
- Kiểm tra accessibility/responsive nếu thay UI.

### Step 8 — Report and checkpoint
Báo cáo:
- Phase/Sub-phase và trạng thái.
- Tài liệu đã cập nhật.
- Code/file đã thay đổi.
- Lệnh đã chạy và output.
- Test pass/fail/not tested.
- Vấn đề còn lại.
- Git branch/status/diff.
- Việc tiếp theo.

Chỉ chuyển sub-phase khi tiêu chí hiện tại đạt hoặc blocker được nhóm trưởng/người có thẩm quyền chấp nhận rõ ràng.

---

## 9. Quy tắc chạy source code trên Windows Native

### 9.1. Frontend

- Dùng Next.js + React + TypeScript theo stack đã xác nhận.
- Xác định package manager từ lockfile; dùng đúng package manager.
- Kiểm tra Node version compatibility trước khi nâng cấp.
- Chạy dev server theo script thực tế trong `package.json`.
- Chạy lint/test/build theo scripts có sẵn hoặc được nhóm thống nhất.
- Không nâng cấp hàng loạt dependency khi không có lý do.
- Không lưu secret trong source hoặc biến môi trường public.

### 9.2. Backend

- Dùng Java 21.
- Ưu tiên Maven Wrapper nếu repository có.
- Chạy test trước khi chạy app.
- Cấu hình datasource qua environment variables/local config không commit.
- Không dùng PostgreSQL superuser cho runtime app.
- Không log credentials/token.
- Chạy Flyway migration và xác minh version.
- Không trả stack trace cho client.

### 9.3. PostgreSQL

- Chạy PostgreSQL native trên Windows.
- Không xóa database/schema hiện có trong audit.
- Tạo database/user ứng dụng riêng sau khi kiểm tra và được phép.
- Backup trước thao tác destructive.
- Migration mới phải chạy được trên database local mới.
- Không sửa migration đã chạy trên môi trường dùng chung.

### 9.4. Quy tắc đồng thời các service

```text
Browser
   |
   v
Next.js Frontend (Windows Native)
   |
   | HTTP / JSON
   v
Spring Boot Backend (Java 21)
   |
   | JDBC
   v
PostgreSQL (Windows Native)
```

Không coi build thành công là đủ. Với feature có UI/API/DB phải thực hiện ít nhất một smoke test qua toàn bộ đường đi.

### 9.5. Local configuration

- `.env.example` chỉ chứa key và giá trị placeholder.
- `.env`, token, password, private key không commit.
- CORS chỉ cho phép origin cần thiết.
- Cấu hình profile local không làm lộ thông tin production.
- README phải mô tả cách tạo database và cấu hình local mà không yêu cầu thao tác destructive.

---

## 10. Git Workflow & Checkpoint

### 10.1. Trước khi code

```bash
git status
git branch --show-current
git log -5 --oneline
git diff
```

Nếu working tree dirty:
- Xác định thay đổi thuộc ai và mục đích gì.
- Không stash/reset/checkout đè thay đổi của người khác khi chưa trao đổi.
- Tạo checkpoint/backup phù hợp trước khi thực hiện thay đổi rủi ro.

### 10.2. Branch naming

- `feat/backend-identity`
- `feat/backend-gameroom`
- `feat/backend-payment`
- `feat/frontend-foundation`
- `feat/frontend-player-flow`
- `feat/frontend-admin-dm`
- `fix/<short-description>`
- `docs/<short-description>`
- `test/<short-description>`

Tên branch thực tế có thể điều chỉnh theo convention repository, nhưng phải nhất quán.

### 10.3. Commit convention

- `feat: ...`
- `fix: ...`
- `test: ...`
- `docs: ...`
- `refactor: ...`
- `chore: ...`

### 10.4. Pull Request

Mỗi PR cần:
- Mục tiêu và phạm vi.
- Feature/issue liên quan.
- Danh sách file/module chính.
- Ảnh UI nếu có.
- API/DB contract bị ảnh hưởng.
- Lệnh test đã chạy và kết quả.
- Migration notes.
- Security/concurrency risks.
- Known issues.

### 10.5. Quy tắc an toàn

- Không commit `.env`, token, password, private key.
- Không commit `node_modules`, build output hoặc IDE cache.
- Không force push.
- Không reset hard.
- Không tự động push/merge nếu chưa được yêu cầu.
- Không gộp PR khi CI/test chưa đạt hoặc conflict chưa xử lý.
- Không sửa migration đã chạy trên môi trường dùng chung.
- Không xóa file/dữ liệu mà chưa xác định owner và backup.
- Chỉ TV1/nhóm trưởng hoặc người được ủy quyền review/merge theo ruleset của repository.

---

## 11. Testing Strategy

| Layer | Kiểm thử | Mục tiêu |
|---|---|---|
| Domain | Unit test | State transition, guards, pricing, rule evaluation |
| Application | Unit/integration | Orchestration, transaction boundary, authorization |
| Persistence | Repository integration | Constraints, query, locking, migration |
| API | Integration/contract | DTO, validation, status code, security |
| Frontend | Component/integration | Form, loading/error, route, role-based UI |
| E2E | Browser/manual E2E | Vertical slice thực tế |
| Concurrency | Concurrent integration | Overbooking, duplicate payment, double assignment |
| Security | Security test/review | RBAC, IDOR, mass assignment, secret leakage |
| Regression | Full P0 suite | Không phá luồng đã nghiệm thu |

### 11.1. P0 invariants bắt buộc

**GameRoom & Participant**
- Một user không có quá giới hạn GameRoom active theo Product Spec.
- FORMING timeout sau 4 giờ; room đã chuyển WAITING_FOR_DM không bị áp dụng timeout này.
- Một user tối đa một active participation trong cùng GameRoom.
- Rejoin tạo participant record mới; record cũ không bị sửa/xóa.
- Rejoin từ `LEFT`/`CANCELLED_UNPAID` được phép nếu room cho phép.
- Rejoin khi refund cũ pending vẫn độc lập payment/refund.
- `LEAVE_REQUESTED` vẫn active cho đến Admin decision.
- Admin cancel mọi GameRoom nonterminal; reason bắt buộc.
- Admin reopen reason bắt buộc; mỗi lần tạo replacement window mới.
- Replacement window 30 phút–4 giờ, không vượt session start.
- Replacement expiry không tự cancel GameRoom.
- READY yêu cầu game conditions, organization readiness, non-empty active participants và tất cả active participants deposit 30%.
- Không yêu cầu remaining 70% để đạt READY.
- DM/schedule change sau READY chuyển về WAITING_FOR_ORGANIZATION.
- Deadline deposit per participant; participant mới không reset deadline người cũ.

**DMAssignment / Scheduling / Session**
- DMAssignment `PENDING` không timeout tự động.
- Chỉ DM được assign mới accept/reject.
- Admin revoke accepted assignment trước Session IN_PROGRESS/COMPLETED; reason bắt buộc.
- Tối đa một ScheduleProposal PROPOSED mỗi GameRoom.
- 100% active participants accept trong 2 giờ; reject/expiry => REJECTED, giữ lịch cũ.
- Session start chỉ bởi DM được assign hoặc Admin theo guard.
- Chỉ Admin emergency-cancel Session IN_PROGRESS; reason bắt buộc.
- DM preparation tối thiểu 12 giờ.
- Không double-book PhysicalRoom/DM.

**Payment / Refund**
- Tiền VNĐ dùng BIGINT.
- Deposit 30% làm tròn lên hàng nghìn; remaining = total - deposit.
- Deadline deposit 2 giờ; retry không giới hạn trong hạn.
- Server request receipt timestamp là chuẩn xử lý deadline race.
- Player không tự gửi amount/status/provider result.
- Cash confirmation đúng actor và chỉ áp dụng remaining.
- Refund amount không vượt số tiền thực nhận.
- Refund do Admin xử lý thủ công; FAILED retry thủ công không giới hạn.
- Admin quyết định 100% hoặc 0% refund khi Player leave sau cọc, reason bắt buộc.
- Late/duplicate payment không hồi sinh participant terminal.
- Không thu tiền/refund hai lần do duplicate request/event.

**System**
- Guest không truy cập dữ liệu riêng.
- User không truy cập resource của user khác.
- Background job chạy lặp không tạo side effect lặp.
- Notification failure không rollback business transaction đã commit.
- Migration chạy được trên database mới.
- Không có secret trong source/log/API response.

### 11.2. Test evidence

Mỗi test report phải phân loại:
- `PASS` — test thực sự chạy và pass.
- `FAIL` — test chạy và fail.
- `NOT RUN` — chưa chạy.
- `BLOCKED` — không thể chạy do blocker được mô tả.

Không chuyển `NOT RUN` thành `PASS` dựa trên code review hoặc suy luận.

---

## 12. Open Decisions & Change Control

Tạo và duy trì `docs/decisions/OPEN_DECISIONS.md`.

### 12.1. Các quyết định đã Accepted — không mở lại như OPEN

- GameRoom/RoomParticipant states, transitions, invariants và side effects Phase 3.
- Admin cancel mọi GameRoom nonterminal; reason bắt buộc.
- Replacement window 30 phút–4 giờ, không vượt session start.
- Replacement deadline hết hạn chuyển `WAITING_FOR_ADMIN_DECISION`, không auto-cancel.
- Admin reopen không giới hạn trong MVP; reason bắt buộc, window/history mới và `reopen_count`.
- Rejoin từ `LEFT`/`CANCELLED_UNPAID` tạo participant record mới; giữ record cũ.
- Rejoin khi refund cũ pending được phép; payment/refund cũ và mới độc lập.
- Deposit deadline per participant; participant mới không reset deadline cũ.
- READY yêu cầu tất cả active participants deposit 30%; không yêu cầu remaining 70%.
- DMAssignment `PENDING` không timeout tự động.
- Admin revoke accepted DM assignment trước Session IN_PROGRESS/COMPLETED; reason bắt buộc.
- ScheduleProposal tối đa một PROPOSED; 100% active participants phản hồi đồng ý trong 2 giờ; reject/expiry => REJECTED, giữ lịch cũ.
- DM được phân công hoặc Admin start Session từ READY.
- Chỉ Admin emergency-cancel Session IN_PROGRESS; reason bắt buộc.
- Payment VND BIGINT; fixed ticket price/person; deposit 30% rounded up to 1,000 VND; remaining = total - deposit.
- Payment retry không giới hạn trong 2 giờ; server request received timestamp xử lý deadline race.
- Refund Admin manual; reference/notes; FAILED retry thủ công không giới hạn.
- Admin quyết định refund 100% hoặc 0% khi Player xin rời sau cọc; reason bắt buộc.

### 12.2. Các nội dung còn OPEN theo Product Spec V15 Final

Chỉ xử lý trước slice phụ thuộc trực tiếp; không tự quyết định thay nhóm:
- Danh sách trường GameRoom được phép chỉnh sửa và thời điểm khóa chỉnh sửa.
- Các loại điều kiện riêng của GameRule và cách biểu diễn/cấu hình có cấu trúc.
- Polling interval theo từng màn hình/nhóm dữ liệu.
- Buffer trước/sau phiên khi kiểm tra lịch DM và PhysicalRoom.
- Có chặn join/rejoin sát giờ nếu không còn đủ 2 giờ cho deposit deadline hay không.
- Cách áp dụng GameRule version mới cho GameRoom đã tạo.

Mọi quyết định kỹ thuật mới phát sinh trong Phase 5/6 (ví dụ lựa chọn locking, schema shape, API path) phải được ghi nhận là technical decision và review; không được mô tả nhầm là business rule đã Accepted.

### 12.3. Decision record template

| Field | Nội dung |
|---|---|
| ID | Mã quyết định |
| Context | Vấn đề cần quyết định |
| Options | Các phương án |
| Recommendation | Đề xuất và lý do |
| Impact | DB/API/UI/security/test/timeline |
| Owner | Người phụ trách |
| Status | OPEN / CONFIRMED / REJECTED |
| Decision date | Ngày xác nhận |
| Evidence | Link PR, spec hoặc test liên quan |

### 12.4. Quy trình khi phát hiện mâu thuẫn

1. Dừng phần code bị ảnh hưởng.
2. Trích dẫn nội dung Product Spec liên quan.
3. Nêu tác động tới domain/API/DB/UI/test.
4. Đưa phương án và khuyến nghị.
5. Chờ người có thẩm quyền xác nhận.
6. Cập nhật decision log và tài liệu liên quan.
7. Sau đó mới tiếp tục code.

---

## 13. Mẫu báo cáo sau mỗi Sub-phase

### A. Kết quả
- Phase/Sub-phase:
- Owner:
- Trạng thái: `DONE` / `PARTIAL` / `BLOCKED` / `FAILED`.
- Mục tiêu:
- Kết quả thực tế:

### B. Documentation
- File mới:
- File cập nhật:
- Decision đã chốt:
- Open Decision còn lại:

### C. Source code
- Frontend files:
- Backend files:
- Database migration:
- API endpoint:
- Dependency mới (nếu có):

### D. Commands & Runtime
- Lệnh đã chạy:
- Frontend runtime:
- Backend runtime:
- Database:
- Smoke test:

### E. Test Evidence
- Unit test:
- Integration test:
- API/contract test:
- Frontend lint/build:
- Migration:
- Manual/E2E:
- Not tested:

### F. Issues/Risks
- Lỗi:
- Nguyên nhân:
- Mức độ:
- Hướng xử lý:
- Cần xác nhận gì:

### G. Git
- Branch:
- `git status`:
- Diff:
- Commit/PR:
- Chưa commit:

### H. Next Step
- Sub-phase tiếp theo:
- Điều kiện cần đạt:
- Blocker:

---

## 14. Prompt khung cho Antigravity theo từng Sub-phase

```text
Bạn đang làm việc trên dự án Kịch Bản Sát.

SOURCE OF TRUTH
- PRODUCT_SPEC_V15_Final.md: baseline yêu cầu sản phẩm.
- IMPLEMENTATION_PLAN_V15_Final.md: kế hoạch thực thi.
- Phase 3 và Phase 4 trong Product Spec đã Accepted ở mức thiết kế nghiệp vụ.
- Phase 5 Database Design và Phase 6 API Contract & Background Jobs chỉ được xem là hoàn tất sau review/acceptance.
- docs/decisions/OPEN_DECISIONS.md: các quyết định còn mở.

REPOSITORY GOVERNANCE
- Repository phát triển chính thức: nguyenxuanhieu2903/kich-ban-sat.
- Danh-K/FE_Kich_Ban_Sat chỉ dùng audit/tham khảo read-only.
- Không dùng repository tham khảo làm base code.
- Nhóm tự xây dựng lại Frontend.
- Nhóm tự thiết kế ERD/Database và API Contract.
- Không copy source, UI, schema, migration, endpoint hoặc DTO từ repo tham khảo.

STACK
- Frontend: Next.js + React + TypeScript.
- Backend: Java 21 + Spring Boot 3.x + Maven.
- Persistence: Spring Data JPA/Hibernate.
- Database: PostgreSQL + Flyway.
- Security: Spring Security/RBAC.
- API: REST/JSON.
- Architecture: Feature-oriented + Layered Architecture.
- IDE chính: VS Code; Antigravity là AI coding agent hỗ trợ.
- Local development: Windows Native.
- Không sử dụng Docker/container trong phạm vi hiện tại.

TASK
Thực hiện đúng Phase/Sub-phase được giao: [PHASE.SUB-PHASE].
Không tự mở rộng phạm vi.

BEFORE CHANGES
1. Đọc Product Spec và Implementation Plan phần liên quan.
2. Đọc ERD/API/Job docs đã được nghiệm thu.
3. Kiểm tra repository, branch, git status, git diff, commit gần nhất.
4. Kiểm tra file liên quan và trạng thái runtime thực tế.
5. Liệt kê file dự kiến thay đổi và rủi ro.
6. Không xóa/ghi đè thay đổi chưa hiểu rõ; tạo checkpoint khi cần.

CONSTRAINTS
- Clean Code, SOLID, separation of concerns.
- Không tự thay đổi business rules Phase 3/4 Accepted.
- Không tự suy diễn Open Decisions.
- Backend là source of truth về authorization, state, deadline, schedule và money.
- Không tin dữ liệu nhạy cảm do client gửi.
- Validate input và resource authorization ở backend.
- Không trả persistence entity trực tiếp.
- Không hardcode secret; không commit .env.
- Database change phải qua Flyway migration mới.
- Không tự động push/merge/reset hard/force push.
- Không thêm dependency/framework mới nếu chưa có lý do và review.
- Không báo PASS/DONE nếu chưa chạy test/lệnh tương ứng.

IMPLEMENTATION METHOD
1. Xác định scope và acceptance criteria.
2. Xác định DB/API/UI/test ảnh hưởng.
3. Cập nhật tài liệu vừa đủ.
4. Implement theo module/layer đã thống nhất.
5. Viết test happy path, negative, boundary và concurrency liên quan.
6. Chạy build/lint/test/migration thật.
7. Chạy smoke test UI → API → DB → UI nếu phù hợp.
8. Review git diff, secret, file ngoài scope và migration.
9. Báo cáo theo mẫu Section 13.
10. Dừng ở sub-phase được giao; không tự chuyển sang phase khác.

OPEN DECISION
Nếu gặp vấn đề chưa được xác nhận ảnh hưởng business correctness, security, database hoặc API:
- Dừng phần phụ thuộc.
- Trích dẫn decision/spec liên quan.
- Nêu tác động và các phương án.
- Chờ xác nhận, không tự chọn thay nhóm.
```

---

## 15. Tiêu chí nghiệm thu MVP cuối cùng

### 15.1. Repository & Environment
- [ ] Chỉ repository `nguyenxuanhieu2903/kich-ban-sat` được dùng phát triển.
- [ ] Repo tham khảo chỉ được audit/tham khảo.
- [ ] Source protection và Git workflow được tuân thủ.
- [ ] Frontend chạy native Windows.
- [ ] Backend chạy native bằng Java 21/Maven.
- [ ] PostgreSQL native hoạt động.
- [ ] Flyway migration chạy trên database mới.
- [ ] README setup được trên máy thành viên khác.
- [ ] Không cần Docker.

### 15.2. Database & API
- [ ] Phase 5 ERD/schema/data dictionary/constraints/indexes được duyệt.
- [ ] Transaction/locking design cho race conditions trọng yếu được duyệt.
- [ ] Migration chạy được và có evidence.
- [ ] Phase 6 API Contract/OpenAPI được duyệt.
- [ ] Authorization matrix bao phủ role/resource.
- [ ] Background jobs có idempotency/retry/failure policy.
- [ ] FE/BE tích hợp theo contract, không tự suy diễn.

### 15.3. Frontend
- [ ] Frontend được nhóm tự xây dựng lại.
- [ ] Có route/layout architecture cho Guest, Player, DM, Admin.
- [ ] Có shared components/design tokens.
- [ ] Có loading/empty/error/success states.
- [ ] Responsive desktop/mobile ở các luồng P0.
- [ ] Route guard chỉ hỗ trợ UX; Backend bảo vệ độc lập.
- [ ] Không còn mock data ở luồng P0 đã tích hợp.

### 15.4. Public & Identity
- [ ] Public Home hoạt động không cần login.
- [ ] Guest xem Game/GameRoom công khai.
- [ ] Protected actions yêu cầu login.
- [ ] Register tạo role PLAYER.
- [ ] Login/logout hoạt động.
- [ ] RBAC/resource authorization hoạt động ở Backend.

### 15.5. GameRoom & Participant
- [ ] Tạo GameRoom đúng rule/time.
- [ ] Giới hạn GameRoom active được enforce.
- [ ] Join/leave theo GameRule.
- [ ] Formation 4 giờ đúng trạng thái.
- [ ] Rejoin tạo participant mới.
- [ ] Per-participant deposit deadline.
- [ ] Replacement window/reopen/cancel đúng policy.
- [ ] Room mất điều kiện được đánh giá lại.
- [ ] Status history/audit được lưu.

### 15.6. DM, Venue & Session
- [ ] Admin assign/reassign/revoke DM đúng quyền.
- [ ] DM accept/reject đúng quyền.
- [ ] Reject không tự hủy GameRoom.
- [ ] DM 12-hour preparation được kiểm tra.
- [ ] Admin chọn PhysicalRoom.
- [ ] Capacity và schedule conflict được enforce.
- [ ] ScheduleProposal 100% confirmation/2h hoạt động.
- [ ] Session start/complete/emergency cancel đúng actor.
- [ ] Schedule/Session history được lưu.

### 15.7. Payment, Refund & Notification
- [ ] Deposit 30% làm tròn lên hàng nghìn.
- [ ] Remaining = total - deposit.
- [ ] Deadline 2 giờ và retry policy hoạt động.
- [ ] Server timestamp xử lý race.
- [ ] Cash confirmation đúng actor.
- [ ] Refund workflow manual, audit và retry đúng policy.
- [ ] Refund không vượt số tiền thực nhận.
- [ ] Notification Center và polling hoạt động.
- [ ] Background jobs idempotent.

### 15.8. Quality & Handover
- [ ] Unit/integration/API/UI/E2E tests cho P0.
- [ ] IDOR/RBAC/security tests.
- [ ] Concurrency tests quan trọng.
- [ ] Frontend build thành công.
- [ ] Backend build/test thành công.
- [ ] Migration clean setup thành công.
- [ ] Không còn blocker/critical chưa được chấp nhận.
- [ ] README, report, slides, demo script hoàn tất.
- [ ] Known limitations/Open Decisions được công khai.
- [ ] Có bằng chứng runtime/test cho các tiêu chí đã đánh dấu.

---

## 16. Quy tắc cuối cùng

- `PRODUCT_SPEC_V15_Final.md` xác định sản phẩm, phạm vi và quyết định đã xác nhận.
- `IMPLEMENTATION_PLAN_V15_Final.md` xác định cách tổ chức công việc, thứ tự triển khai, phân công, timeline, test và nghiệm thu.
- Phase 3/4 Accepted là trạng thái thiết kế nghiệp vụ, không phải trạng thái implementation.
- Phase 5 phải tự thiết kế ERD/Database; Phase 6 phải tự thiết kế API Contract/Background Jobs.
- Phase 7 triển khai Backend và Frontend song song theo contract; Frontend được xây dựng lại.
- Chỉ repository `nguyenxuanhieu2903/kich-ban-sat` là nơi phát triển chính thức.
- Repo `Danh-K/FE_Kich_Ban_Sat` chỉ audit/tham khảo.
- Không sử dụng Docker/container trong phạm vi hiện tại.
- Ưu tiên P0 end-to-end; không hy sinh correctness, security hoặc data integrity để chạy theo số lượng tính năng.
- Không đánh dấu hoàn thành bằng số lượng file/code; chỉ đánh dấu khi có runtime/test evidence.
- Tài liệu cũ được giữ nguyên; mọi thay đổi phải tạo version mới và có Change Log.

---

## Nguồn đối chiếu

- `PRODUCT_SPEC_V15_Final.md` — baseline sản phẩm và các quyết định Phase 3/4 Accepted.
- `IMPLEMENTATION_PLAN_V14(1).md` — nguồn kế thừa cấu trúc thực thi, workflow, Windows Native, Git, testing, báo cáo và acceptance checklist.
- Các quyết định phân công/timeline 4 tuần đã thống nhất trong dự án Kịch Bản Sát.
