import { Modal } from "@/components/common/Modal";
import DeletePost from "@/components/confirm-post/DeletePost";

export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;

  return (
    <>
      <Modal>
        <DeletePost postId={postId} />
      </Modal>
    </>
  );
}
