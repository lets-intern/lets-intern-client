import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import TableRowEditorMenu from './TableRowEditorMenu';
import axios from '../../../../../../../utils/axios';

interface Props {
  setIsModeAdd: (isModeAdd: boolean) => void;
}

const NewTableRowEditor = ({ setIsModeAdd }: Props) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [values, setValues] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('');

  const addMission = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(`/mission/${params.programId}`, values);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mission'] });
      setIsModeAdd(false);
      setValues({});
    },
    onError: (error: any) => {
      setErrorMessage(error.response.data.reason);
    },
  });

  const handleMissionAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMission.mutate(values);
  };

  const handleEditorClose = () => {
    setIsModeAdd(false);
    window.scrollTo(0, 0);
  };

  return (
    <TableRowEditorMenu
      values={values}
      mode="CREATE"
      setValues={setValues}
      onSubmit={handleMissionAdd}
      onCancel={handleEditorClose}
      errorMessage={errorMessage}
      className="mt-2"
    />
  );
};

export default NewTableRowEditor;