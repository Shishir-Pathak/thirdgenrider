import BlogFormModal from "../components/dashboard/BlogFormModal";
import BlogsTable from "../components/dashboard/BlogsTable";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DeleteBlogModal from "../components/dashboard/DeleteBlogModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import { useBlogsAdmin } from "../hooks/useBlogsAdmin";

const DashboardBlogs = () => {
	const blogsAdmin = useBlogsAdmin();

	return (
		<>
			<DashboardHeader
				title="Blog Posts"
				addLabel="+ Add Blog"
				onAdd={blogsAdmin.openAdd}
			/>

			<ListErrorBanner
				message={blogsAdmin.listError}
				onRetry={blogsAdmin.loadBlogs}
			/>

			<BlogsTable
				blogs={blogsAdmin.blogs}
				loading={blogsAdmin.loading}
				onEdit={blogsAdmin.openEdit}
				onDelete={blogsAdmin.setDeleteTarget}
			/>

			<BlogFormModal
				open={Boolean(blogsAdmin.formModal)}
				mode={blogsAdmin.formModal?.mode}
				blog={blogsAdmin.formModal?.blog}
				draft={blogsAdmin.draft}
				onDraftChange={blogsAdmin.setDraft}
				onTitleChange={blogsAdmin.updateTitle}
				formError={blogsAdmin.formError}
				submitting={blogsAdmin.formSubmitting}
				imageInputRef={blogsAdmin.imageInputRef}
				onClose={blogsAdmin.closeForm}
				onSubmit={blogsAdmin.submitForm}
			/>

			<DeleteBlogModal
				blog={blogsAdmin.deleteTarget}
				submitting={blogsAdmin.deleteSubmitting}
				onCancel={() => blogsAdmin.setDeleteTarget(null)}
				onConfirm={blogsAdmin.confirmDelete}
			/>
		</>
	);
};

export default DashboardBlogs;
