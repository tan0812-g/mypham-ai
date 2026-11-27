-- Run once against mypham_ai to add granular access for staff accounts.
ALTER TABLE nhan_vien
  ADD COLUMN quyenHan TEXT NOT NULL DEFAULT '[]';
