import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
  category: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
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
  category,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const defaultImageUrl = "/gift.png"; // 기본 이미지 경로

  return (
    <Link href={`/products/${id}`}>
      <div className="group relative flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100">
        <button
          type="button"
          aria-label="찜하기"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute right-3 top-3 z-10 rounded-full border bg-white/90 p-2 shadow-sm transition-colors ${
            isFavorite
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-gray-400 hover:text-orange-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
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
          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {category}
          </span>
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

