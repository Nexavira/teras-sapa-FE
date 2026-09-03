import { useEffect, useRef, useState } from 'react'

import { Link, useRouter } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  Add01Icon,
  ArrowDown01Icon,
  LinkSquare02Icon,
  Logout01Icon,
  Notification01Icon,
  Search01Icon,
} from 'hugeicons-react'

import { Avatar } from '#/components/ui/primitives/Avatar'
import { Badge } from '#/components/ui/primitives/Badge'
import { Divider } from '#/components/ui/primitives/Divider'
import { IconButton } from '#/components/ui/primitives/IconButton'
import { Typography } from '#/components/ui/primitives/Typography'
import { theme } from '#/components/ui/theme'
import { useGetUserSession } from '#/services/auth/useGetUserSession'
import { useSignOut } from '#/services/auth/useSignOut'

const TopHeader = styled.header`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 2.5vw, 32px);
  flex-shrink: 0;
  z-index: 50;
  border-bottom: 1px solid ${theme.colors.border};

  @media (max-width: 640px) {
    height: 64px;
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
`

const BrandLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${theme.colors.text.primary};
`

const Wordmark = styled.span`
  color: ${theme.colors.text.primary};
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.07em;

  span {
    color: ${theme.colors.primary.DEFAULT};
  }
`

const HeaderCenter = styled.div`
  flex: 1;
  max-width: 480px;
  margin: 0 20px;
  display: flex;
  justify-content: center;
`

const SearchCapsule = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 32px;
  padding: 4px 6px 4px 16px;
  gap: 10px;
  width: 100%;
  box-shadow: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
  }

  &:focus-within {
    border-color: ${theme.colors.primary.DEFAULT};
    box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.18);
  }

  @media (max-width: 720px) {
    display: none;
  }
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.85rem;
  color: ${theme.colors.text.primary};
  width: 100%;
  outline: none;

  &::placeholder {
    color: ${theme.colors.text.secondary};
    font-weight: 400;
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`

const ProfileCapsuleButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background};
  border: 1px solid
    ${({ $isOpen }) => ($isOpen ? theme.colors.primary.DEFAULT : theme.colors.border)};
  padding: 4px 6px 4px 12px;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? '0 2px 4px rgba(0,0,0,0.12)' : 'none'};

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    border-color: ${theme.colors.border};
  }
`

const ChevronIcon = styled(ArrowDown01Icon)<{ $isOpen: boolean }>`
  color: ${theme.colors.text.secondary};
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid ${theme.colors.border};
  padding: 8px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: ${theme.colors.background};
`

const StoreInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 0.825rem;
  font-weight: 500;
  color: #222222;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background-color: ${theme.colors.primary.LIGHTER};
  }
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
`

const UserText = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export interface HeaderProps {
  storeName?: string
  className?: string
}

export const Header = ({ storeName = 'My Store', className }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const signOutMutation = useSignOut()
  const { data: session } = useGetUserSession()

  const userName = session?.user.name ?? undefined
  const userEmail = session?.user.email ?? undefined

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync()
      router.navigate({ to: '/login' })
    } catch {
      router.navigate({ to: '/login' })
    }
  }

  return (
    <TopHeader className={className}>
      <HeaderLeft>
        <BrandLogo to="/admin">
          <Wordmark>
            TerasSapa<span>.</span>
          </Wordmark>
        </BrandLogo>
      </HeaderLeft>

      <HeaderCenter>
        <SearchCapsule>
          <SearchInput placeholder="Search anything across your store..." />
          <Badge variant="neutral" size="sm" style={{ opacity: 0.72 }}>
            CTRL K
          </Badge>
          <IconButton
            variant="primary"
            size="sm"
            type="button"
            style={{ background: theme.colors.primary.DEFAULT }}
          >
            <Search01Icon size={14} />
          </IconButton>
        </SearchCapsule>
      </HeaderCenter>

      <HeaderRight ref={dropdownRef}>
        <IconButton
          variant="ghost"
          size="sm"
          badge={true}
          title="Notifications"
          aria-label="Notifications"
          style={{
            border: '1px solid rgba(255,255,255,.15)',
            color: theme.colors.text.primary,
          }}
        >
          <Notification01Icon size={16} />
        </IconButton>

        <ProfileCapsuleButton
          $isOpen={dropdownOpen}
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
        >
          <Typography
            variant="body"
            weight="medium"
            css={{ fontSize: '0.8125rem' }}
          >
            {storeName}
          </Typography>
          <ChevronIcon size={13} $isOpen={dropdownOpen} />
          <Avatar initials="MS" size="xs" shape="circle" color="secondary" />
        </ProfileCapsuleButton>

        {dropdownOpen && (
          <DropdownMenu>
            <DropdownHeader>
              <StoreInfo>
                <Avatar
                  initials="MS"
                  size="sm"
                  shape="circle"
                  color="secondary"
                />
                <Typography variant="body" weight="bold">
                  {storeName}
                </Typography>
              </StoreInfo>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="View Storefront"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <IconButton variant="ghost" size="sm">
                  <LinkSquare02Icon size={16} />
                </IconButton>
              </a>
            </DropdownHeader>

            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <Add01Icon size={16} />
              Create new store
            </DropdownItem>

            <Divider style={{ margin: '4px 0' }} />

            <UserRow>
              <Avatar name={userName} size="sm" color="primary" />
              <UserText>
                <Typography variant="body" weight="bold">
                  {userName}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {userEmail}
                </Typography>
              </UserText>
            </UserRow>

            <DropdownItem
              onClick={handleSignOut}
              style={{ color: theme.colors.error }}
            >
              <Logout01Icon size={16} />
              Log out
            </DropdownItem>
          </DropdownMenu>
        )}
      </HeaderRight>
    </TopHeader>
  )
}
