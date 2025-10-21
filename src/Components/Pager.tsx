import Pagination  from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PagerProps {
  numberOfPages: number;
  page?: number;
  onChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function Pager({ numberOfPages, page, onChange }: PagerProps) {
  return (
    <Stack spacing={2}>
      <Pagination count={numberOfPages} page={page} onChange={onChange} color="primary" />
    </Stack>
  );
}
