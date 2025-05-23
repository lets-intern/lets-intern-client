import BlogListContent from '@components/BlogListContent';

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      {/* 블로그 배너 */}
      <header className="mb-8 flex h-[154px] w-full items-center bg-blog-banner-sm bg-cover bg-no-repeat px-5 md:mb-11 md:h-[168px] md:bg-blog-banner-md md:px-0 lg:bg-blog-banner-lg">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-1 md:gap-2">
          <h1 className="text-small20 font-bold text-neutral-100 md:text-medium24">
            렛츠커리어 블로그
          </h1>
          <p className="text-xsmall14 text-white/90 md:text-xsmall16">
            취업 준비부터 실무까지, 커리어의 시작을 돕습니다.
            <br />
            독자적인 커리어 교육 콘텐츠를 확인해보세요.
          </p>
        </div>
      </header>

      {/* 블로그 콘텐츠 */}
      <main className="mx-auto mb-12 w-full max-w-[1100px] px-5 md:mb-20 md:px-0">
        <BlogListContent />
      </main>
    </div>
  );
}
