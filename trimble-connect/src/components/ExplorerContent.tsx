import { ModusWcButton, ModusWcChip, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

const filters = [
  'TCDSA-2 short-text',
  'TCDSA-2 long-text',
  'TCDSA-2-Number',
  'TCDSA-2 short-Date',
  'TCDSA-2 User',
];

interface FileEntry {
  name: string;
  type: 'folder' | 'file';
  modifiedBy: string;
  modifiedOn: string;
  size: string;
  tags: string;
}

const files: FileEntry[] = [
  { name: 'Jose_Test', type: 'folder', modifiedBy: 'Jose Manuel Martinez Gomez', modifiedOn: 'Jun 08, 2026', size: '809.2 MB', tags: '' },
  { name: 'Josh Test', type: 'folder', modifiedBy: 'Josh Heath', modifiedOn: 'Jun 15, 2026', size: '1.1 GB', tags: '' },
  { name: 'Test_Files', type: 'folder', modifiedBy: 'Jose Martinez', modifiedOn: 'Apr 01, 2026', size: '1.99 MB', tags: '' },
  { name: 'VenturA_test', type: 'folder', modifiedBy: 'Alejandro Ventura', modifiedOn: 'Jun 15, 2026', size: '567.18 MB', tags: '' },
  { name: 'Yair Test', type: 'folder', modifiedBy: 'Yair Ruiz', modifiedOn: 'May 05, 2026', size: '0 B', tags: '' },
  { name: 'nwd-to-trb.trb', type: 'file', modifiedBy: 'Alejandro Ventura', modifiedOn: 'Jun 15, 2026', size: '563.55 MB', tags: '' },
  { name: 'output.pdf', type: 'file', modifiedBy: 'Yair Ruiz', modifiedOn: 'Apr 06, 2026', size: '470.4 KB', tags: '' },
];

export default function ExplorerContent() {
  return (
    <main className="explorer-content">
      <div className="explorer-header">
        <ModusWcTypography hierarchy="h1" customClass="explorer-title">
          Explorer
        </ModusWcTypography>
        <div className="explorer-actions">
          <div className="explorer-view-group">
            <ModusWcButton
              color="tertiary"
              variant="borderless"
              shape="square"
              size="sm"
              customClass="explorer-icon-btn"
              aria-label="Grid view"
            >
              <ModusWcIcon decorative name="view_grid" size="sm" variant="solid" />
            </ModusWcButton>
            <ModusWcButton
              color="tertiary"
              variant="borderless"
              shape="square"
              size="sm"
              customClass="explorer-icon-btn explorer-icon-btn--active"
              aria-label="List view"
              aria-pressed
            >
              <ModusWcIcon decorative name="view_list" size="sm" variant="solid" />
            </ModusWcButton>
            <ModusWcButton
              color="tertiary"
              variant="borderless"
              size="sm"
              customClass="explorer-view-3d"
            >
              3D
            </ModusWcButton>
            <ModusWcButton
              color="tertiary"
              variant="borderless"
              shape="square"
              size="sm"
              customClass="explorer-icon-btn"
              aria-label="More options"
            >
              <ModusWcIcon decorative name="more_vertical" size="sm" variant="solid" />
            </ModusWcButton>
          </div>
          <ModusWcButton color="primary" variant="filled" size="sm">
            Add
          </ModusWcButton>
        </div>
      </div>

      <div className="explorer-filters">
        {filters.map((filter) => (
          <ModusWcChip
            key={filter}
            label={`${filter} ▾`}
            variant="outline"
            size="sm"
            showRemove={false}
          />
        ))}
        <span className="all-filters-link">All filters →</span>
      </div>

      <div className="explorer-table">
        <table className="connect-table">
          <thead>
            <tr>
              <th className="col-name">
                <div className="th-content">
                  <span>Name</span>
                  <ModusWcIcon decorative name="sort_arrow_up" size="sm" />
                </div>
              </th>
              <th className="col-modified-by">
                <div className="th-content">
                  <span>Modified by</span>
                  <ModusWcIcon decorative name="caret_down" size="sm" />
                </div>
              </th>
              <th className="col-modified-on">
                <div className="th-content">
                  <span>Modified on</span>
                  <ModusWcIcon decorative name="caret_down" size="sm" />
                </div>
              </th>
              <th className="col-size">
                <div className="th-content">
                  <span>Size</span>
                  <ModusWcIcon decorative name="caret_down" size="sm" />
                </div>
              </th>
              <th className="col-tags">
                <div className="th-content">
                  <span>Tags</span>
                  <ModusWcIcon decorative name="caret_down" size="sm" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.name}>
                <td className="col-name">
                  <div className="file-name-cell">
                    <ModusWcIcon
                      decorative
                      name={file.type === 'folder' ? 'folder_closed' : 'file'}
                      size="sm"
                    />
                    <span>{file.name}</span>
                  </div>
                </td>
                <td className="col-modified-by">{file.modifiedBy}</td>
                <td className="col-modified-on">{file.modifiedOn}</td>
                <td className="col-size">{file.size}</td>
                <td className="col-tags">{file.tags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
