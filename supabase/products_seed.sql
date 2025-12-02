insert into public.products (id, title, price, category, created_at, image_url)
overriding system value
values
  (1, '아이폰 15 Pro Max 256GB', 1500000, '디지털기기', timezone('utc', now()) - interval '30 minutes', null),
  (2, '맥북 프로 14인치 M3', 2500000, '디지털기기', timezone('utc', now()) - interval '2 hours', null),
  (3, '에어팟 프로 2세대', 350000, '디지털기기', timezone('utc', now()) - interval '5 hours', null),
  (4, '갤럭시 S24 울트라 512GB', 1400000, '디지털기기', timezone('utc', now()) - interval '1 day', null),
  (5, '아이패드 프로 12.9인치', 1200000, '디지털기기', timezone('utc', now()) - interval '2 days', null),
  (6, '닌텐도 스위치 OLED', 450000, '게임/취미', timezone('utc', now()) - interval '3 days', null),
  (7, '한샘 원목 식탁 세트', 380000, '가구/인테리어', timezone('utc', now()) - interval '4 days', null),
  (8, '필립스 스팀다리미', 90000, '생활가전', timezone('utc', now()) - interval '6 days', null),
  (9, '코베아 캠핑 의자 2p', 120000, '스포츠/레저', timezone('utc', now()) - interval '7 days', null),
  (10, '헬리녹스 캠핑 테이블', 150000, '스포츠/레저', timezone('utc', now()) - interval '9 days', null),
  (11, '무선 청소기 LG 코드제로', 280000, '생활가전', timezone('utc', now()) - interval '10 days', null),
  (12, '미니멀 주방 수납장', 250000, '생활/주방', timezone('utc', now()) - interval '12 days', null),
  (13, '미니멀리즘 인테리어 도서 세트', 45000, '도서/티켓/음반', timezone('utc', now()) - interval '13 days', null),
  (14, '슬림 러닝머신', 320000, '스포츠/레저', timezone('utc', now()) - interval '15 days', null)
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price,
  category = excluded.category,
  created_at = excluded.created_at,
  image_url = excluded.image_url;

