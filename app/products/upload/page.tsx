'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductUploadPage() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title || !category || !price || !description || !image) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            // 1. Upload Image
            const fileExt = image.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('product-image')
                .upload(fileName, image);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-image')
                .getPublicUrl(fileName);

            // 3. Insert Data
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('로그인이 필요합니다.');

            const insertPayload = {
                title,
                category,
                price: Number(price),
                description,
                image_url: publicUrl,
                user_id: user.id,
            };
            console.log('Inserting data:', insertPayload);

            const { data, error: insertError } = await supabase
                .from('products')
                .insert(insertPayload)
                .select();

            console.log('Insert result:', { data, insertError });

            if (insertError) {
                throw insertError;
            }

            alert('상품이 등록되었습니다!');
            router.push('/');
        } catch (error: any) {
            console.error('Error uploading product:', error);
            alert(`상품 등록 중 오류가 발생했습니다: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">내 물건 팔기</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-contain rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭해서 사진 업로드</span></p>
                                <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                            </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">제목</label>
                    <input
                        type="text"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                        placeholder="글 제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">카테고리</label>
                    <select
                        id="category"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">카테고리 선택</option>
                        <option value="디지털기기">디지털기기</option>
                        <option value="가구/인테리어">가구/인테리어</option>
                        <option value="유아동">유아동</option>
                        <option value="의류">의류</option>
                        <option value="식품">식품</option>
                        <option value="취미/게임/음반">취미/게임/음반</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">가격</label>
                    <input
                        type="number"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                        placeholder="₩ 가격을 입력해주세요"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">자세한 설명</label>
                    <textarea
                        id="description"
                        rows={4}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="게시글 내용을 작성해주세요. (가품 및 판매금지품목은 게시가 제한될 수 있어요.)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? '등록 중...' : '등록하기'}
                </button>
            </form>
        </div>
    );
}
