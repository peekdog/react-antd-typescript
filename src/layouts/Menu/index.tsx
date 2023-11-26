import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icon from '@ant-design/icons';
import { Menu as AntMenu, MenuProps, } from 'antd';

import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { RouteType, RouteState } from '@/types/route';
import { useDispatch, useSelector } from 'react-redux';
import { addTab } from '@/redux/actions/appActions';
import { ADD_TAB } from '@/redux/constants/type';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
  externalLinkMap: Record<string, boolean>;
  items: MenuItem[];
}

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const current = location.pathname

  const { routes } = useSelector((state: RouteState) => ({
    routes: state.route.routes,
    loading: state.route.loading,
  }));

  const externalLinkMap: Record<string, boolean> = {};
  const generateItems = (routes: RouteType[]): MenuItem[] => {
    const items: MenuItem[] = [];

    for (const item of routes) {
      const { icon, children, isExternalLink, isMenu, path, type } = item;
      let label = item.title;
      if (!isMenu) continue;

      const IconComponent = (Icon as unknown as { [key: string]: React.ComponentType<AntdIconProps> })[icon] || null;

      if (isExternalLink) {
        externalLinkMap[path] = true;
        label = <a href={path} target="_blank" rel="noopener noreferrer">{t(label)}</a> as unknown as string;
      }

      items.push({
        key: path,
        icon: IconComponent && <IconComponent />,
        children: children?.length ? generateItems(children) : undefined,
        label: typeof label === 'string' ? t(label) : label,
        type,
      });
    }
    return items;
  }

  const items = generateItems(routes);

  const onClick: MenuProps['onClick'] = (e) => {
    if (externalLinkMap[e.key] || e.key === current) return;
    navigate(e.key);
    dispatch(addTab({ key: e.key, label: '迭代' }))
  };
  
  return (
    <AntMenu
      theme="dark"
      mode="inline"
      selectedKeys={[current]}
      items={items}
      onClick={onClick}
    />
  )
};

export default Menu;
