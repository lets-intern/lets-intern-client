'use client';

import KakaoIcon from '@/assets/icons/kakao_path.svg?react';

interface Props {
  title: string;
  description: string;
  thumbnail: string;
  pathname: string;
  className?: string;
  iconClassName?: string;
  fill?: string;
}

function BlogKakaoShareBtn({
  title,
  description,
  thumbnail,
  pathname,
  className,
  iconClassName,
  fill,
}: Props) {
  const handleShareKakaoClick = () => {
    if (!window.Kakao) return;

    const kakao = window.Kakao;
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: thumbnail,
        link: {
          mobileWebUrl: `${window.location.origin}${pathname}`,
          webUrl: `${window.location.origin}${pathname}`,
        },
      },
      buttons: [
        {
          title: '글 확인하기',
          link: {
            mobileWebUrl: `${window.location.origin}${pathname}`,
            webUrl: `${window.location.origin}${pathname}`,
          },
        },
      ],
    });
  };

  return (
    <button type="button" className={className} onClick={handleShareKakaoClick}>
      <KakaoIcon
        height={20}
        width={20}
        className={iconClassName}
        fill={fill ?? '#5C5F66'}
      />
    </button>
  );
}

export default BlogKakaoShareBtn;
