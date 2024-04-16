export interface OrderVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 创建时间
   */
  creatTime: string;

  /**
   * 发布人
   */
  pushUser: string;

  /**
   * 接收人
   */
  work: string;

  /**
   * 发布信息
   */
  text: string;

  /**
   * 发布金额
   */
  money: number;

  /**
   * 限制时间
   */
  linitTime: string;

  /**
   * 开发语言
   */
  type: string;

  /**
   * 是否需要论文
   */
  isPaper: string;

  /**
   * 发布状态
   */
  isRelease: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 修改人
   */
  updateUser: string;
}

export interface OrderForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 创建时间
   */
  creatTime?: string;

  /**
   * 发布人
   */
  pushUser?: string;

  /**
   * 接收人
   */
  work?: string;

  /**
   * 发布信息
   */
  text?: string;

  /**
   * 发布金额
   */
  money?: number;

  /**
   * 限制时间
   */
  linitTime?: string;

  /**
   * 开发语言
   */
  type?: string;

  /**
   * 是否需要论文
   */
  isPaper?: string;

  /**
   * 发布状态
   */
  isRelease?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 修改人
   */
  updateUser?: string;
}

export interface OrderQuery extends PageQuery {
  /**
   * 创建时间
   */
  creatTime?: string;

  /**
   * 发布人
   */
  pushUser?: string;

  /**
   * 接收人
   */
  work?: string;

  /**
   * 发布金额
   */
  money?: number;

  /**
   * 限制时间
   */
  linitTime?: string;

  /**
   * 开发语言
   */
  type?: string;

  /**
   * 是否需要论文
   */
  isPaper?: string;

  /**
   * 发布状态
   */
  isRelease?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
