// import React, { useState, useImperativeHandle } from 'react';
// import { Form, Select, message, Modal, Input } from 'antd';
// // import { useLibraryModel } from './modal';

// const { Item: FormItem } = Form;

// interface BaseFormProps {
//   onSave?: (store: any) => void;
//   cref?: any;
// }

// const SaveModal: React.FC<BaseFormProps> = (props) => {
//   const { onSave, cref } = props;
//   const [form] = Form.useForm();

//   const [visible, setVisible] = useState<boolean>(false);
//   // const [libraryList, getLibraryList] = useLibraryModel();

//   const save = async () => {
//     form
//       .validateFields()
//       .then((res: any) => {
//         onSave?.(res);
//       })
//       .catch((err: any) => {
//         message.warning('参数错误');
//       });
//   };

//   const close = () => {
//     setVisible(false);
//   };

//   useImperativeHandle(cref, () => ({
//     open() {},
//     close() {},
//   }));

//   return (
//     <Modal
//       title="保存看板"
//       visible={visible}
//       onOk={save}
//       okText={'保存'}
//       onCancel={close}
//       cancelText={'取消'}
//     >
//       <div>
//         <Form form={form}>
//           <FormItem
//             name="analysisName"
//             label="看板名称"
//             rules={[{ required: true, message: '请输入留存名称' }]}
//           >
//             <Input placeholder="请填写看板名称" style={{ width: '300px' }}></Input>
//           </FormItem>
//           <FormItem
//             name="analysisDir"
//             label="看板目录"
//             rules={[{ required: true, message: '请选择看板目录' }]}
//           >
//             <Select>
//               {libraryList.map((item: any) => {
//                 return (
//                   <Select.Option value={item.value} key={item.value} item={item}>
//                     {item.label}
//                   </Select.Option>
//                 );
//               })}
//             </Select>
//           </FormItem>
//         </Form>
//       </div>
//     </Modal>
//   );
// };

// export default SaveModal;
