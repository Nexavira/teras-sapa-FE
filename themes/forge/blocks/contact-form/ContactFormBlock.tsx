import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ContactFormSettings {
  submit_label?: string
  name_placeholder?: string
  email_placeholder?: string
  company_placeholder?: string
  brief_placeholder?: string
}

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 7px;
  border-radius: var(--forge-card-radius);
  background: rgba(23, 25, 21, 0.06);
  box-shadow: var(--forge-card-shadow);
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  label {
    display: flex;
    min-height: 92px;
    flex-direction: column;
    gap: 8px;
    padding: 18px 20px;
    border-radius: var(--forge-input-radius);
    background: var(--forge-paper);
    color: #777a72;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
    box-sizing: border-box;
  }

  label:last-of-type {
    grid-column: 1 / -1;
    min-height: 180px;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--forge-ink);
    font-size: 15px;
    resize: none;
    font-family: inherit;

    &:focus-visible {
      outline: var(--forge-input-border-width) solid var(--forge-input-focus);
      outline-offset: 5px;
    }
  }

  button {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 9px 8px 22px;
    border: 0;
    border-radius: var(--forge-button-radius);
    background: var(--forge-ink);
    color: var(--forge-paper);
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;
    transition: transform 650ms var(--forge-ease);
    letter-spacing: var(--forge-button-letter-spacing);
    text-transform: var(--forge-button-text-transform);
  }

  button span {
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 650ms var(--forge-ease);
  }

  button:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }

  button:active {
    transform: scale(0.98);
  }
`

export const ContactFormBlock: React.FC<
  BlockComponentProps<ContactFormSettings>
> = ({ settings }) => {
  const {
    submit_label = 'Send enquiry',
    name_placeholder = 'Your name',
    email_placeholder = 'name@company.com',
    company_placeholder = 'Company name',
    brief_placeholder = 'Scope, timing and the problem we can help solve',
  } = settings

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <label>
        Name
        <input name="name" placeholder={name_placeholder} />
      </label>
      <label>
        Work email
        <input name="email" placeholder={email_placeholder} type="email" />
      </label>
      <label>
        Company
        <input name="company" placeholder={company_placeholder} />
      </label>
      <label>
        Area
        <select defaultValue="" name="area">
          <option disabled value="">
            Select a discipline
          </option>
          <option>Precision fabrication</option>
          <option>Systems integration</option>
          <option>Industrial automation</option>
        </select>
      </label>
      <label>
        Project brief
        <textarea name="brief" placeholder={brief_placeholder} />
      </label>
      <button type="submit">
        {submit_label} <span>↗</span>
      </button>
    </Form>
  )
}
