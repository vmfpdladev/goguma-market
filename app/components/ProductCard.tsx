import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
}

// 시간 포맷팅 함수 (몇 분 전, 몇 시간 전)
function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const created = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}개월 전`;
}

// 가격 포맷팅 함수 (콤마 추가)
function formatPrice(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export default function ProductCard({
  id,
  title,
  price,
  imageUrl,
  createdAt,
}: ProductCardProps) {
  const defaultImageUrl = "/gift.png"; // 기본 이미지 경로

  return (
    <Link href={`/products/${id}`}>
      <div className="group relative flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100">
        {/* 상품 이미지 */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={defaultImageUrl}
                alt={title}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="p-4 flex flex-col gap-2">
          {/* 상품 제목 */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>

          {/* 가격 */}
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </p>

          {/* 등록 시간 */}
          <p className="text-sm text-gray-500">
            {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

