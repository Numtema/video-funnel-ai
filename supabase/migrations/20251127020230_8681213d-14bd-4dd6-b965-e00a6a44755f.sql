-- Add status column to submissions table
ALTER TABLE submissions 
ADD COLUMN status text DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'contacté', 'converti'));

-- Add index for faster filtering
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);