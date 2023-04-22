# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength

# jellyAnon: a jelly bean table that contains only boolean data
#
# | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
# | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
# | true     | false | false | false | true  | false  | false | true   | false | false  |
# | true     | false | true  | false | true  | true   | false | false  | false | false  |
# | false    | false | false | false | true  | false  | false | false  | true  | false  |
# | false    | false | false | false | false | true   | false | false  | false | false  |
# | false    | false | false | false | false | true   | false | false  | true  | false  |
# | true     | false | true  | false | false | false  | false | true   | true  | false  |
# | false    | false | true  | false | false | false  | false | false  | true  | false  |
# | true     | false | false | false | false | false  | true  | true   | false | false  |
# | true     | false | false | false | false | false  | false | true   | false | false  |
# | false    | true  | false | false | false | true   | true  | false  | true  | false  |
RSpec.describe 'brown jelly beans' do
  include Basics

  describe 'returns a table with only brown jelly beans' do
    let(:schema) do
      Schema.new(
        headers: [
          { column_name: 'get acne', sort: Boolean },
          { column_name: 'red', sort: Boolean },
          { column_name: 'black', sort: Boolean },
          { column_name: 'white', sort: Boolean },
          { column_name: 'green', sort: Boolean },
          { column_name: 'yellow', sort: Boolean },
          { column_name: 'brown', sort: Boolean },
          { column_name: 'orange', sort: Boolean },
          { column_name: 'pink', sort: Boolean },
          { column_name: 'purple', sort: Boolean }
        ]
      )
    end

    let(:rows) do
      [
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', true),
            Cell.new('red', false),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', true),
            Cell.new('yellow', false),
            Cell.new('brown', false),
            Cell.new('orange', true),
            Cell.new('pink', false),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', true),
            Cell.new('red', false),
            Cell.new('black', true),
            Cell.new('white', false),
            Cell.new('green', true),
            Cell.new('yellow', true),
            Cell.new('brown', false),
            Cell.new('orange', false),
            Cell.new('pink', false),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', false),
            Cell.new('red', false),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', true),
            Cell.new('yellow', false),
            Cell.new('brown', false),
            Cell.new('orange', false),
            Cell.new('pink', true),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', false),
            Cell.new('red', false),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', true),
            Cell.new('brown', false),
            Cell.new('orange', false),
            Cell.new('pink', false),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', false),
            Cell.new('red', false),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', true),
            Cell.new('brown', false),
            Cell.new('orange', false),
            Cell.new('pink', true),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', true),
            Cell.new('red', false),
            Cell.new('black', true),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', false),
            Cell.new('brown', false),
            Cell.new('orange', true),
            Cell.new('pink', true),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', false),
            Cell.new('red', false),
            Cell.new('black', true),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', false),
            Cell.new('brown', false),
            Cell.new('orange', false),
            Cell.new('pink', true),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', true),
            Cell.new('red', false),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', false),
            Cell.new('brown', true),
            Cell.new('orange', true),
            Cell.new('pink', false),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', true),
            Cell.new('red', false),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', false),
            Cell.new('brown', false),
            Cell.new('orange', true),
            Cell.new('pink', false),
            Cell.new('purple', false)
          ]
        ),
        Row.new(
          schema: schema,
          cells: [
            Cell.new('get acne', false),
            Cell.new('red', true),
            Cell.new('black', false),
            Cell.new('white', false),
            Cell.new('green', false),
            Cell.new('yellow', true),
            Cell.new('brown', true),
            Cell.new('orange', false),
            Cell.new('pink', true),
            Cell.new('purple', false)
          ]
        )
      ]
    end

    let(:table) { Table.new(schema: schema, rows: rows) }

    context 'when unhappy path' do
      context 'when passing a non-valid column name' do
        it 'fails since "color" is not a valid column name - user meant to pass variable name' do
          count_participants = lambda do |t, color|
            Table.tfilter(t) { |r| tkeep_wrong(r, color) }.nrows
          end

          expect { count_participants.call(table, 'brown') }.to raise_error(RequireException)
        end

        it 'fails since "turquoise" is not a valid column name' do
          count_participants = lambda do |t, color|
            Table.tfilter(t) { |r| tkeep_correct(r, color) }.nrows
          end

          expect { count_participants.call(table, 'turquoise') }.to raise_error(RequireException)
        end
      end

      context 'when passing a valid column name' do
        it 'returns the correct number of participants' do
          count_participants = lambda do |t, color|
            Table.tfilter(t) { |r| tkeep_correct(r, color) }.nrows
          end

          expect(count_participants.call(table, 'get acne')).to eq(5)
          expect(count_participants.call(table, 'red')).to eq(1)
          expect(count_participants.call(table, 'black')).to eq(3)
          expect(count_participants.call(table, 'white')).to eq(0)
          expect(count_participants.call(table, 'green')).to eq(3)
          expect(count_participants.call(table, 'yellow')).to eq(4)
          expect(count_participants.call(table, 'brown')).to eq(2)
          expect(count_participants.call(table, 'orange')).to eq(4)
          expect(count_participants.call(table, 'pink')).to eq(5)
          expect(count_participants.call(table, 'purple')).to eq(0)
        end
      end
    end
  end

  def tkeep_wrong(row, color)
    get_value(row, 'color')
  end

  def tkeep_correct(row, color)
    get_value(row, color)
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable Metrics/BlockLength
