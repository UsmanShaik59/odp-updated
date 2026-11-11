import {BookAssetHost,type BookAssetProps} from '../book-asset-host/BookAssetHost';
export type WorkingVolumesProps=BookAssetProps;
/** Standalone editions extracted from complete-shelf-landing-page. */
export function WorkingVolumes(props:WorkingVolumesProps){return <BookAssetHost {...props} kind="complete" title="Working Volumes"/>;}
