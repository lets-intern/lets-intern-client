import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';

import TableTemplate, {
  TableTemplateProps,
} from '../../../../components/admin/ui/table/new/TableTemplate';
import axios from '../../../../utils/axios';
import TableCell from '../../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../../components/admin/ui/table/new/TableRow';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import TableManageContent from '../../../../components/admin/ui/table/new/TableManageContent';
import AlertModal from '../../../../components/ui/alert/AlertModal';
import dayjs from 'dayjs';

type ProgramBannersTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const PopUpBanners = () => {
  const queryClient = useQueryClient();

  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const columnMetaData: TableTemplateProps<ProgramBannersTableKey>['columnMetaData'] =
    {
      title: {
        headLabel: '제목',
        cellWidth: 'w-3/12',
      },
      link: {
        headLabel: '링크',
        cellWidth: 'w-3/12',
      },
      visible: {
        headLabel: '노출 여부',
        cellWidth: 'w-1/12',
      },
      visiblePeriod: {
        headLabel: '노출 기간',
        cellWidth: 'w-3/12',
      },
      management: {
        headLabel: '관리',
        cellWidth: 'w-2/12',
      },
    };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'PROGRAM',
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios(`/${queryKey[0]}/${queryKey[1]}`, {
        params: queryKey[2],
      });
      return res.data;
    },
  });

  const programBannerList: {
    id: number;
    title: string;
    link: string;
    startDate: string;
    endDate: string;
    isValid: boolean;
    isVisible: boolean;
    imgUrl: string;
  }[] = data?.data?.bannerList || [];

  const deleteProgramBanner = useMutation({
    mutationFn: async (bannerId: number) => {
      const res = await axios.delete(`/banner/${bannerId}`, {
        params: {
          type: 'PROGRAM',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      setIsDeleteModalShown(false);
    },
  });

  const editProgramBannerVisible = useMutation({
    mutationFn: async (params: { bannerId: number; formData: FormData }) => {
      const { bannerId, formData } = params;
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'PROGRAM',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
    },
  });

  const handleVisibleCheckboxClicked = (
    bannerId: number,
    isVisible: boolean,
  ) => {
    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob(
        [
          JSON.stringify({
            isVisible,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    editProgramBannerVisible.mutate({ bannerId, formData });
  };

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
      <TableTemplate<ProgramBannersTableKey>
        title="프로그램 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/banner/program-banners/new',
        }}
        columnMetaData={columnMetaData}
        minWidth="60rem"
      >
        {isLoading ? (
          <div className="py-6 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-6 text-center">에러 발생</div>
        ) : programBannerList.length === 0 ? (
          <div className="py-6 text-center">프로그램 배너가 없습니다.</div>
        ) : (
          programBannerList.map((banner) => (
            <TableRow key={banner.id} minWidth="60rem">
              <TableCell cellWidth={columnMetaData.title.cellWidth}>
                {banner.title}
              </TableCell>
              <TableCell cellWidth={columnMetaData.link.cellWidth} textEllipsis>
                <Link
                  to={banner.link}
                  target="_blank"
                  rel="noopenner noreferrer"
                  className="hover:underline"
                >
                  {banner.link}
                </Link>
              </TableCell>
              <TableCell cellWidth={columnMetaData.visible.cellWidth}>
                <Checkbox
                  checked={banner.isVisible}
                  onChange={() =>
                    handleVisibleCheckboxClicked(banner.id, !banner.isVisible)
                  }
                />
              </TableCell>
              <TableCell cellWidth={columnMetaData.visiblePeriod.cellWidth}>
                {dayjs(banner.startDate).format('YYYY년 MM월 DD일')} ~{' '}
                {dayjs(banner.endDate).format('YYYY년 MM월 DD일')}
              </TableCell>
              <TableCell cellWidth={columnMetaData.management.cellWidth}>
                <TableManageContent>
                  <Link to={`/admin/banner/program-banners/${banner.id}/edit`}>
                    <i>
                      <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                    </i>
                  </Link>
                  <button onClick={() => handleDeleteButtonClicked(banner.id)}>
                    <i className="text-[1.75rem]">
                      <CiTrash />
                    </i>
                  </button>
                </TableManageContent>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableTemplate>
      {isDeleteModalShown && (
        <AlertModal
          title="프로그램 배너 삭제"
          onConfirm={() =>
            bannerIdForDeleting &&
            deleteProgramBanner.mutate(bannerIdForDeleting)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 프로그램 배너를 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default PopUpBanners;
