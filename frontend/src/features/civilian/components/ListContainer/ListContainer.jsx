const ListContainer = ({ children, title, emptyMessage = 'No items to display' }) => {
  const hasItems = children && (Array.isArray(children) ? children.length > 0 : true);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {title && (
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {title}
        </h3>
      )}
      {hasItems ? (
        <div className="space-y-4">{children}</div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">📭</p>
          <p className="mt-2">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ListContainer;
