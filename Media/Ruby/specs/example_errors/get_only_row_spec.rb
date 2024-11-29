# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength

# students: a simple table with no values missing
RSpec.describe 'get only row' do
  include Basics

  describe 'handles error as expected' do
    let(:raw_table_string) do
      "
      # | name    | age | favorite color |
      # | ------- | --- | -------------- |
      # | \"Bob\"   | 12  | \"blue\"         |
      # | \"Alice\" | 17  | \"green\"        |
      # | \"Eve\"   | 13  | \"red\"          |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    context 'when happy path' do
      context 'when correct program' do
        # > getValue(
        #   getRow(
        #     tfilter(students,
        #       function(r):
        #         getValue(r, "name") == "Alice"
        #       end),
        #     0),
        #   "favorite color")
        let(:participants_whose_name_is_alice) do
          lambda do |t|
            Table.tfilter(t) do |r|
              get_value(r, 'name') == '"Alice"'
            end.get_row(0)
          end
        end

        it 'returns the correct number of participants who like green' do
          result = participants_whose_name_is_alice.call(table)
          expect(result.cells).to eq(table.get_row(1).cells)
        end
      end
    end

    context 'when buggy program' do
      context 'when returning value directly instead of a predicate' do
        # > getValue(
        #   getRow(
        #     tfilter(students,
        #       function(r):
        #         getValue(r, "name") == "Alice"
        #       end),
        #     1),
        #   "favorite color")
        let(:participants_whose_name_is_alice) do |_t|
          lambda do |t|
            Table.tfilter(t) do |r|
              get_value(r, 'name') == '"Alice"'
            end.get_row(1)
          end
        end

        it 'fails with require' do
          expect { participants_whose_name_is_alice.call(table) }.to raise_error(RequireException)
        end
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable Metrics/BlockLength
